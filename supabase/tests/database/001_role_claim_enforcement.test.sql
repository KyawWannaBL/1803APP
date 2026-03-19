begin;
select plan(2);

do $$
declare
  uid uuid := '11111111-1111-1111-1111-111111111111';
  created_profiles boolean := false;
begin
  if to_regclass('public.profiles') is null then
    created_profiles := true;
    execute 'create table public.profiles(id uuid primary key, role text)';
  end if;

  if to_regclass('auth.users') is not null then
    insert into auth.users (
      id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
      uid, 'authenticated', 'authenticated', 't@t.com', '{}'::jsonb, '{}'::jsonb, now(), now()
    )
    on conflict (id) do nothing;
  end if;

  delete from public.profiles where id = uid;
  insert into public.profiles(id, role) values (uid, 'MERCHANT');

  perform set_config('request.jwt.claim.sub', uid::text, true);
  perform set_config('request.jwt.claim.email', 't@t.com', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid::text, 'email', 't@t.com', 'app_role', 'SUPERVISOR')::text,
    true
  );
  perform is(public.effective_role(), null, 'JWT app_role mismatch vs DB role => effective_role() is NULL');

  perform set_config('request.jwt.claim.sub', uid::text, true);
  perform set_config('request.jwt.claim.email', 't@t.com', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid::text, 'email', 't@t.com', 'app_role', 'MERCHANT')::text,
    true
  );
  perform is(public.effective_role(), 'MERCHANT', 'JWT app_role matches DB role => effective_role() returns role');

  if created_profiles then
    execute 'drop table public.profiles';
  end if;
end $$;

select * from finish();
rollback;
