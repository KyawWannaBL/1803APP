begin;
select plan(3);

select has_table('public', 'shipment_approvals', 'public.shipment_approvals exists');

select ok(
  (select c.relrowsecurity
   from pg_class c join pg_namespace n on n.oid=c.relnamespace
   where n.nspname='public' and c.relname='shipment_approvals'),
  'RLS enabled on shipment_approvals'
);

select lives_ok($$
  do $$
  declare
    uid uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  begin
    perform set_config('request.jwt.claim.sub', uid::text, true);
    perform set_config('request.jwt.claim.email', 'supervisor@test.local', true);
    perform set_config('request.jwt.claims', json_build_object(
      'sub', uid::text,
      'email','supervisor@test.local',
      'app_role','SUPERVISOR'
    )::text, true);

    execute 'set local role authenticated';

    -- if your approvals require a shipment_id FK, seed one first in migrations or adjust here
    -- this is a policy/existence smoke test
    perform 1;
  end $$;
$$, 'SUPERVISOR role context can execute (extend with approve/update once fixture exists)');

select * from finish();
rollback;
