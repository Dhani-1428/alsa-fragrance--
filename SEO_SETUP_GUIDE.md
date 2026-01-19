# Google Search Console Setup Guide for Alsa Fragrance

This guide will help you verify your website ownership and submit your site to Google Search Console for indexing.

## Prerequisites

- Website is live at: https://www.alsafragrance.com
- Access to your domain's DNS settings (if using DNS verification)
- Google account

---

## Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click "Add Property" or "Add a property"

---

## Step 2: Choose Property Type

Select **"URL prefix"** (recommended for single domain):
- Enter: `https://www.alsafragrance.com`
- Click "Continue"

---

## Step 3: Verify Ownership

Choose **ONE** of these verification methods:

### Option A: HTML File Upload (Recommended - Already Done)

1. **Verification File Status**: 
   - File is already uploaded: `/public/google3231990485fdc786.html`
   - Accessible at: `https://www.alsafragrance.com/google3231990485fdc786.html`
   - **Verify the file is accessible before proceeding**

2. **In Google Search Console**:
   - Select "HTML file upload" method
   - Enter the filename: `google3231990485fdc786.html`
   - Click "Verify"

3. **If verification fails**:
   - Check that the file is accessible: Visit `https://www.alsafragrance.com/google3231990485fdc786.html` in a browser
   - Ensure the file content matches: `google-site-verification: google3231990485fdc786.html`
   - Wait 5-10 minutes after deployment for the file to be live

### Option B: HTML Tag (Meta Tag)

1. **In Google Search Console**:
   - Select "HTML tag" method
   - Copy the verification code (looks like: `<meta name="google-site-verification" content="..." />`)

2. **Already Configured**:
   - The verification code is already in `app/layout.tsx`:
   - `verification: { google: "google3231990485fdc786" }`
   - If Google provides a different code, update this value

3. **Click "Verify"** in Google Search Console

### Option C: DNS Verification

1. **In Google Search Console**:
   - Select "DNS record" method
   - Copy the TXT record value provided by Google

2. **In Your DNS Provider**:
   - Add a new TXT record:
     - **Name/Host**: `@` or your domain name
     - **Value**: The verification code from Google
     - **TTL**: 3600 (or default)

3. **Wait for DNS Propagation**:
   - Usually takes 5 minutes to 48 hours
   - Use [DNS Checker](https://dnschecker.org/) to verify propagation

4. **Return to Google Search Console** and click "Verify"

---

## Step 4: Submit Sitemap

After verification:

1. **In Google Search Console**:
   - Go to "Sitemaps" in the left sidebar
   - Enter: `https://www.alsafragrance.com/sitemap.xml`
   - Click "Submit"

2. **Verify Sitemap is Accessible**:
   - Visit: `https://www.alsafragrance.com/sitemap.xml`
   - Should display XML with all pages

3. **Expected Sitemap Contents**:
   - Homepage
   - Shop page
   - Category pages (Men, Women, Attars, Testers, Limited Edition, New Arrivals)
   - About page
   - Contact page
   - All product pages (dynamically generated)

---

## Step 5: Request Indexing for Key Pages

1. **Use URL Inspection Tool**:
   - In Google Search Console, click "URL Inspection" (search bar at top)
   - Enter each URL below and click "Request Indexing":
     - `https://www.alsafragrance.com`
     - `https://www.alsafragrance.com/shop`
     - `https://www.alsafragrance.com/men`
     - `https://www.alsafragrance.com/women`
     - `https://www.alsafragrance.com/about`
     - `https://www.alsafragrance.com/contact`

2. **Verify Pages are Indexable**:
   - The tool will show if pages can be indexed
   - Fix any issues reported (e.g., noindex tags, robots.txt blocks)

---

## Step 6: Monitor Indexing Status

1. **Check Coverage Report**:
   - Go to "Coverage" in the left sidebar
   - Monitor:
     - Valid pages (should increase over time)
     - Errors (fix any issues)
     - Excluded pages (review if needed)

2. **Check Performance**:
   - Go to "Performance" after a few days
   - Monitor search impressions and clicks
   - Track keyword rankings

---

## Step 7: Set Preferred Domain

1. **Go to Settings**:
   - Click "Settings" in the left sidebar
   - Under "Preferred domain":
     - Select `www.alsafragrance.com` (recommended)
     - This matches your `middleware.ts` redirect configuration

---

## Troubleshooting

### Issue: "Verification failed"
**Solutions**:
- Ensure the verification file is accessible: `https://www.alsafragrance.com/google3231990485fdc786.html`
- Check that the file content matches exactly
- Wait 10-15 minutes after deployment
- Try a different verification method

### Issue: "Sitemap couldn't be fetched"
**Solutions**:
- Verify sitemap is accessible: `https://www.alsafragrance.com/sitemap.xml`
- Check robots.txt doesn't block `/sitemap.xml`
- Ensure sitemap is valid XML
- Wait a few minutes and try again

### Issue: "URL is not on Google"
**Solutions**:
- Use "Request Indexing" in URL Inspection tool
- Check the page has no `noindex` tags
- Verify robots.txt allows crawling
- Wait 1-2 weeks for Google to crawl (can take longer)

### Issue: "Page is indexed but not appearing in search"
**Solutions**:
- Optimize page titles and descriptions (already done)
- Add more quality content
- Build backlinks
- Improve page speed (use PageSpeed Insights)
- Wait longer (indexing ≠ ranking)

---

## Expected Timeline

- **Verification**: Instant (if file is accessible)
- **Sitemap Processing**: 1-7 days
- **Initial Indexing**: 1-2 weeks
- **Full Indexing**: 2-4 weeks
- **Search Visibility**: 2-8 weeks (varies by keyword competition)

---

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Google Search Central](https://developers.google.com/search)
- [Test Your Mobile-Friendly Site](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Next Steps After Setup

1. **Monitor Coverage**: Check for indexing errors weekly
2. **Submit New Content**: Request indexing for new products/pages
3. **Monitor Performance**: Track which keywords bring traffic
4. **Fix Issues**: Address any crawl errors or indexing problems
5. **Optimize Content**: Update titles/descriptions based on search performance

---

## Contact & Support

If you encounter issues:
- Check the troubleshooting section above
- Review [Google Search Console Help](https://support.google.com/webmasters)
- Ensure all files are deployed correctly
- Verify environment variables are set correctly

---

**Last Updated**: January 2025
**Website**: https://www.alsafragrance.com
**Verification Code**: `google3231990485fdc786`
