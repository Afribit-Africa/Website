# Google Search Console Integration

This application already supports Google Search Console HTML tag verification through Next.js metadata.

## What The Code Already Does

- emits the Google verification meta tag from `src/app/layout.tsx`
- reads the token from `GOOGLE_SITE_VERIFICATION`
- exposes the sitemap at `https://afribit.africa/sitemap.xml`
- exposes crawler directives at `https://afribit.africa/robots.txt`

## Recommended Property Type

Choose the property type based on who controls the DNS zone.

### URL-prefix property

Use this when you want verification to be handled in the application.

1. In Google Search Console, add `https://afribit.africa/` as a URL-prefix property.
2. Choose the HTML tag verification method.
3. Copy the token from the meta tag `content` attribute.
4. Set `GOOGLE_SITE_VERIFICATION` in the production environment.
5. Redeploy the site.
6. Verify the property in Search Console.
7. Submit `https://afribit.africa/sitemap.xml`.

Example:

```env
GOOGLE_SITE_VERIFICATION="your-token-from-google"
```

Google gives a full tag that looks like this:

```html
<meta name="google-site-verification" content="your-token-from-google" />
```

Only the `content` value should go into the environment variable.

### Domain property

Use this when the team controls the domain DNS and wants coverage for all subdomains and protocols.

1. In Google Search Console, add `afribit.africa` as a domain property.
2. Add the TXT verification record in DNS.
3. Verify the property in Search Console.
4. Submit `https://afribit.africa/sitemap.xml`.

This method is outside the repository because DNS verification is not controlled by application code.

## Post-Verification Checklist

After the property is verified:

1. Submit the sitemap.
2. Inspect the homepage URL in Search Console.
3. Request indexing for priority routes such as `/`, `/about`, `/community`, `/donate`, `/merchants`, and `/programs`.
4. Monitor coverage, canonical selection, and mobile usability reports.

## Notes

- The app is already emitting Open Graph, Twitter, robots, sitemap, manifest, and JSON-LD metadata.
- If verification fails for a URL-prefix property, check that the production deployment actually has `GOOGLE_SITE_VERIFICATION` set and that the rendered homepage contains the expected meta tag.