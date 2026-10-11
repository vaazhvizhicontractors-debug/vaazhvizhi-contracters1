VAAZHVIZHI CONTRACTERS — BLUE / GREEN / WHITE SITE REBUILD

Files
- index.html: revised site, choice section and two separate forms
- style.css: responsive blue + green + white theme, custom CSS architectural illustration, inline SVG icons
- script.js: menu, project preselect, Quick WhatsApp only, two-step detailed form submission
- Code.gs: Apps Script receiver for detailed quotes, Google Sheet append, duplicate submission ID check, GmailApp notification

DEPLOYMENT
1. Upload index.html, style.css and script.js to the root of the existing GitHub repository. Keep the exact names.
2. The detailed form posts to the Apps Script URL already configured in index.html. It uses a hidden iframe to avoid fetch/CORS issues.
3. Check the Apps Script project is bound to the correct spreadsheet. If standalone, fill CONFIG.SPREADSHEET_ID with the spreadsheet ID.
4. If Sheet1 is empty, the receiver creates the agreed headers there. If Sheet1 already contains older data with a different/missing header layout, the receiver preserves it and writes new quotes to a separate “Detailed Quotes” tab rather than mixing incompatible columns.
5. Apps Script deployment: Web app, Execute as Me, access Anyone; update the existing deployment. Authorize GmailApp if email notifications are enabled.
6. Quick Enquiry only opens WhatsApp. It never posts to Sheets or triggers Gmail.
7. Detailed Quote only posts to Apps Script/Google Sheets and does not open WhatsApp automatically. Gmail notification is handled by Code.gs if enabled.
8. Submit one clearly identifiable test quote, verify its row in Sheet1 or Detailed Quotes, then verify Gmail separately. Delete the test row if desired.

TESTING STATUS
Frontend and Apps Script syntax checks passed in this environment. These files have not been pushed to GitHub, and the deployed Apps Script/Sheet/Gmail flow has not been live-tested from here. The frontend can confirm a save only when the deployed Code.gs returns its postMessage response.
