# Black Summit Partner Activation — Task 4

No partner contract terms, commission amounts, credentials, or underwriting data belong in this repository.

## Activation gate
Do not change a category to `active` in `partner-config.js` until:
1. Black Summit has verified the partner relationship is approved.
2. The referral method / URL is confirmed.
3. Traffic-source rules permit Black Summit's intended traffic.
4. Required disclosure language is confirmed.
5. Any required partner-specific consent language is approved.

## Activate a category
Edit only that category record in `partner-config.js`:
- status: `active`
- partner_key: stable internal slug
- display_name: public partner name
- referral_url: exact HTTPS referral URL
- cta_label: public button label
- disclosure: required compensation/referral disclosure
- requires_review: true/false

The rest of the site reads that single record automatically.

## Task 4 tracking
The Netlify form `partner-events` records:
- partner CTA impressions
- review-path clicks
- referral intent / consent
- outbound partner clicks
- source page
- business_id when available
- first-touch and last-touch attribution

## Task 4 does not claim
- partner approval of a merchant
- guaranteed savings
- underwriting results
- commissions received
- partner-reported conversions

Conversions and commissions should only be recorded after reconciliation with partner reporting.
