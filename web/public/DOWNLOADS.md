# Britium Mobile / APK Delivery

This package does not include a compiled Android APK binary.

To publish the APK download button in production, place your signed Android package here:

- `apps/web/public/britium-enterprise.apk`

Then update the login action link to point to:

- `/britium-enterprise.apk`

Recommended release flow:
1. Build signed Android APK or AAB from the mobile client.
2. Copy the signed artifact into `apps/web/public/`.
3. Redeploy Vercel.
4. Verify the file downloads from the production domain.

