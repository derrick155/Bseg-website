# BSEG Task 4.1 Hardening Patch

This patch is designed to be reviewed in a branch / Netlify Deploy Preview before merge.

## Changes
- Removes merchant-statement uploads from the public review form.
- Merchant-review scoring no longer awards statement-upload points.
- Validates website format before awarding website points.
- Reduces browser localStorage profile data to business_id + timestamps only.
- Adds Privacy Policy and Terms & Referral Disclosure pages.
- Adds legal links to the funding and Business Solutions footers.
- Removes stale "Task 2" public wording.
- Hides the entire inactive-partner section so it creates no blank vertical space.
- Adds Netlify security headers.
- Adds robots.txt and sitemap.xml.
- Adds a homepage meta description and canonical tags.
- Improves explicit label/control associations on site forms.
- Partner categories remain Candidate; no referral URLs are activated.

## Important
The Privacy Policy and Terms are practical launch templates, not a substitute for legal review. Before meaningful paid traffic or partner data-sharing volume, Black Summit should have counsel review the public legal copy and partner-specific disclosure requirements.

## QA before merge
1. Open every route on the Netlify Deploy Preview.
2. Confirm no blank partner section appears while all partners are Candidate.
3. Complete the Stack Finder once.
4. Submit one clearly labeled TEST merchant review (no real sensitive data).
5. Submit one TEST request through Payroll, CRM, and Forms.
6. Verify Netlify receives each expected form.
7. Verify Privacy and Terms routes load.
8. Verify the production funding page layout was not changed other than footer/legal metadata.
