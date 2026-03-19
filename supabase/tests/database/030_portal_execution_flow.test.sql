begin;
select plan(3);

select has_table('public', 'shipments', 'public.shipments exists');

select lives_ok($$
  do $$
  declare
    uid uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  begin
    perform set_config('request.jwt.claim.sub', uid::text, true);
    perform set_config('request.jwt.claim.email', 'rider@test.local', true);
    perform set_config('request.jwt.claims', json_build_object(
      'sub', uid::text,
      'email','rider@test.local',
      'app_role','RIDER'
    )::text, true);

    execute 'set local role authenticated';

    -- update smoke test (requires an existing row)
    perform 1;
  end $$;
$$, 'RIDER role context can execute (extend with status update once fixture exists)');

select has_table('public', 'shipment_tracking', 'public.shipment_tracking exists');

select * from finish();
rollback;
