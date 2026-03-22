DO $$
DECLARE
    v_user RECORD;
    v_uid UUID;
    v_role_level VARCHAR(10);
BEGIN
    -- 1. Create a temporary table to safely batch all input accounts
    CREATE TEMP TABLE tmp_new_users (
        email VARCHAR(255),
        role VARCHAR(50),
        full_name VARCHAR(255)
    ) ON COMMIT DROP;

    -- 2. Insert the raw data provided into the temporary table
    INSERT INTO tmp_new_users (email, role, full_name) VALUES
    ('admin@britiumexpress.com', 'SUPER_ADMIN', 'BRITIUM EXPRESS'),
    ('aln_br@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('bd_assist@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('br_mgr1@britiumexpress.com', 'SUPERVISOR', 'BRITIUM EXPRESS'),
    ('byn_br@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('cashier_1@britiumexpress.com', 'FINANCE_USER', 'BRITIUM EXPRESS'),
    ('cs_1@britiumexpress.com', 'CUSTOMER_SERVICE', 'BRITIUM EXPRESS'),
    ('cs_2@britiumexpress.com', 'CUSTOMER_SERVICE', 'BRITIUM EXPRESS'),
    ('general1@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general2@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general3@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general4@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general5@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general6@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general7@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('general8@britiumexpress.com', 'STAFF', 'BRITIUM EXPRESS'),
    ('gm@britiumexpress.com', 'SUPER_ADMIN', 'BRITIUM EXPRESS'),
    ('hlg_br@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('hod@britiumexpress.com', 'OPERATIONS_ADMIN', 'BRITIUM EXPRESS'),
    ('hradmin_am@britiumexpress.com', 'HR_ADMIN', 'BRITIUM EXPRESS'),
    ('hradmin_mgr@britiumexpress.com', 'HR_ADMIN', 'BRITIUM EXPRESS'),
    ('info@britiumexpress.com', 'MARKETING_ADMIN', 'BRITIUM EXPRESS'),
    ('info_mdy@britiumexpress.com', 'MARKETING_ADMIN', 'BRITIUM EXPRESS'),
    ('info_npt@britiumexpress.com', 'MARKETING_ADMIN', 'BRITIUM EXPRESS'),
    ('nok_br@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('npw@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('opt_am@britiumexpress.com', 'SUPERVISOR', 'BRITIUM EXPRESS'),
    ('opt_mgr@britiumexpress.com', 'SUPERVISOR', 'BRITIUM EXPRESS'),
    ('opt_sup@britiumexpress.com', 'SUPERVISOR', 'BRITIUM EXPRESS'),
    ('rider.yangon01@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('sai@britiumexpress.com', 'SUPER_ADMIN', 'BRITIUM EXPRESS'),
    ('sales_exe@britiumexpress.com', 'MARKETING_ADMIN', 'BRITIUM EXPRESS'),
    ('tgg_br@britiumexpress.com', 'SUBSTATION_MANAGER', 'BRITIUM EXPRESS'),
    ('finance@britiumexpress.com', 'FINANCE_STAFF', 'BRITIUM EXPRESS'),
    ('warehouse_mgr@britiumexpress.com', 'WAREHOUSE_MANAGER', 'BRITIUM EXPRESS'),
    ('dataentry001@britiumexpress.com', 'DATA_ENTRY', 'BRITIUM EXPRESS'),
    ('driver_ygn001@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn002@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn003@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn004@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn005@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn006@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn007@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn008@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn009@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_ygn010@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_mdy001@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_mdy002@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_mdy003@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_npw001@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_npw002@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('driver_npw003@britiumexpress.com', 'DRIVER', 'BRITIUM EXPRESS'),
    ('helper_ygn001@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn002@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn003@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn004@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn005@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn006@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn007@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn008@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn009@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_ygn0010@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_mdy001@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_mdy002@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_mdy003@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_npw001@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_npw002@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('helper_npw003@britiumexpress.com', 'HELPER', 'BRITIUM EXPRESS'),
    ('rider_ygn00001@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00002@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00003@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00004@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00005@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00006@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00007@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00008@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00009@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00010@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00011@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00012@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00013@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00014@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00015@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00016@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00017@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00018@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00019@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00020@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00021@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00022@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00023@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00024@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00025@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00026@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00027@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00028@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00029@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_ygn00030@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00001@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00002@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00003@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00004@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00005@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00006@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00007@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00008@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00009@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00010@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00011@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00012@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00013@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00014@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00015@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00016@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00017@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_mdy00018@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00001@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00002@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00003@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00004@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00005@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00006@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00007@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00008@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00009@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00010@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00011@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00012@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00013@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00014@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00015@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00016@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00017@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS'),
    ('rider_npw00018@britiumexpress.com', 'RIDER', 'BRITIUM EXPRESS');

    -- 3. Loop over data, apply mapping, insert into Auth, Identities, and Profiles
    FOR v_user IN SELECT * FROM tmp_new_users LOOP
        -- Map strictly to required internal Role Hierarchy
        v_role_level := CASE v_user.role
            WHEN 'APP_OWNER' THEN 'L5'
            WHEN 'SUPER_ADMIN' THEN 'L5'
            WHEN 'HR_ADMIN' THEN 'L3'
            WHEN 'MARKETING_ADMIN' THEN 'L3'
            WHEN 'OPERATIONS_ADMIN' THEN 'L3'
            WHEN 'FINANCE_STAFF' THEN 'L3'
            WHEN 'SUPERVISOR' THEN 'L2'
            WHEN 'WAREHOUSE_MANAGER' THEN 'L2'
            WHEN 'SUBSTATION_MANAGER' THEN 'L2'
            WHEN 'FINANCE_USER' THEN 'L1'
            WHEN 'RIDER' THEN 'L1'
            WHEN 'DRIVER' THEN 'L1'
            WHEN 'HELPER' THEN 'L1'
            WHEN 'STAFF' THEN 'L1'
            WHEN 'DATA_ENTRY' THEN 'L1'
            WHEN 'CUSTOMER_SERVICE' THEN 'L1'
            ELSE 'L0'
        END;

        -- Step A: Safely retrieve or insert into auth.users 
        SELECT id INTO v_uid FROM auth.users WHERE email = v_user.email;

        IF v_uid IS NULL THEN
            v_uid := gen_random_uuid();
            
            INSERT INTO auth.users (
                id,
                instance_id,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                role,
                aud,
                confirmation_token
            ) VALUES (
                v_uid,
                '00000000-0000-0000-0000-000000000000',
                v_user.email,
                crypt('Britium@2026', gen_salt('bf')),
                now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('full_name', v_user.full_name),
                now(),
                now(),
                'authenticated',
                'authenticated',
                encode(gen_random_bytes(32), 'hex')
            );
        ELSE
            -- Reset existing passwords to the new default requirement
            UPDATE auth.users
            SET encrypted_password = crypt('Britium@2026', gen_salt('bf'))
            WHERE id = v_uid;
        END IF;

        -- Step B: Insert into auth.identities
        IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_uid) THEN
            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                v_uid, v_uid, jsonb_build_object('sub', v_uid::text, 'email', v_user.email), 'email', v_user.email, now(), now(), now()
            );
        END IF;

        -- Step C: Insert or Update public.profiles
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_uid) THEN
            UPDATE public.profiles
            SET 
                role = v_user.role,
                role_code = v_user.role,
                role_level = CASE WHEN role_level = 'L5' THEN 'L5' ELSE v_role_level END,
                full_name = v_user.full_name,
                must_change_password = true,
                requires_password_change = true,
                is_active = true
            WHERE id = v_uid;
        ELSE
            INSERT INTO public.profiles (
                id, email, full_name, role, role_code, role_level,
                must_change_password, requires_password_change, is_active, created_at, environment
            ) VALUES (
                v_uid, v_user.email, v_user.full_name, v_user.role, v_user.role, v_role_level,
                true, true, true, now(), 'PRODUCTION'
            );
        END IF;

    END LOOP;
END
$$;
