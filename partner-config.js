/*
  Black Summit Partner Activation Config — Task 4

  A category is monetized ONLY when:
    status === "active"
    partner_key is non-empty
    display_name is non-empty
    referral_url is a valid HTTPS URL

  Do not place compensation terms, contracts, API secrets, or underwriting data here.
*/
window.BSEG_PARTNER_CONFIG = Object.freeze({
  version: "task4-v1",
  categories: Object.freeze({
    payments: Object.freeze({
      status: "candidate",
      partner_key: "",
      display_name: "",
      referral_url: "",
      cta_label: "View payment processing option",
      disclosure: "Black Summit may receive compensation if you choose to work with an activated processing partner.",
      requires_review: true
    }),
    payroll: Object.freeze({
      status: "candidate",
      partner_key: "",
      display_name: "",
      referral_url: "",
      cta_label: "View payroll option",
      disclosure: "Black Summit may receive compensation if you choose to work with an activated payroll partner.",
      requires_review: false
    }),
    crm: Object.freeze({
      status: "candidate",
      partner_key: "",
      display_name: "",
      referral_url: "",
      cta_label: "View CRM option",
      disclosure: "Black Summit may receive compensation if you choose to work with an activated CRM partner.",
      requires_review: false
    }),
    forms: Object.freeze({
      status: "candidate",
      partner_key: "",
      display_name: "",
      referral_url: "",
      cta_label: "View forms option",
      disclosure: "Black Summit may receive compensation if you choose to work with an activated forms partner.",
      requires_review: false
    })
  })
});
