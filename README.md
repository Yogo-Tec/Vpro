# Vpro Billing Software

A professional, mobile-responsive billing and invoice creator built with HTML, CSS, JavaScript, and Bootstrap 5.

## Plan and structure

The application is split into three working sections:

1. **Company & invoice** - business identity, invoice number, project ID, and date.
2. **Customer & project** - customer billing details and project description.
3. **Payment & notes** - advance, amount paid, tax/extra charges, account details, and invoice terms.

## Features

- Professional invoice UI inspired by the supplied reference template.
- Mobile responsive layout using Bootstrap 5 and custom CSS.
- Add, edit, remove, and delete invoice line items.
- Automatic subtotal, grand total, balance, and amount-in-words calculation.
- Save/download invoice as XML.
- Save As option for custom XML file names.
- Upload XML invoices for future editing.
- Print-friendly invoice output.
- Browser local draft autosave.

## Files

```text
index.html              Main billing application UI
assets/css/styles.css   Professional responsive and print styling
assets/js/app.js        Billing logic, XML save/upload, edit/remove/delete, calculations
USE_ME.md               Step-by-step user guide
```

## Run locally

Open `index.html` in any modern browser. Internet access is recommended because Bootstrap 5 is loaded from a CDN.
