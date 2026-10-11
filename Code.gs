/** Vaazhvizhi Contracters - Detailed Quote receiver.
 * Bind this script to the target spreadsheet, or set SPREADSHEET_ID below.
 * Quick WhatsApp enquiries are intentionally not sent to this backend.
 */
const CONFIG = {
  SPREADSHEET_ID: '', // Leave blank only when this Apps Script is bound to the target spreadsheet.
  SHEET_NAME: 'Sheet1',
  NOTIFY_EMAIL: 'vaazhvizhicontractors@gmail.com',
  SEND_EMAIL_NOTIFICATION: true
};
const HEADERS = ['Timestamp','Submission ID','Name','Phone','Email','Location','Project Type','Service','Budget','Requirement','Notification Status'];

function doPost(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const submissionId = clean_(params.submissionId, 100);
  if (clean_(params.website, 200)) return respond_({success:false, message:'Invalid submission.'});
  const name = clean_(params.name, 100);
  const phone = clean_(params.phone, 20);
  const email = clean_(params.email, 150);
  const location = clean_(params.location, 200);
  const projectType = clean_(params.projectType, 100);
  const service = clean_(params.service, 150);
  const budget = clean_(params.budget, 100);
  const requirement = clean_(params.requirement, 2500);
  if (!name || !phone || !location || !projectType || !service || !requirement) {
    return respond_({success:false, message:'Please complete all required fields.'});
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return respond_({success:false, message:'Please enter a valid mobile number.'});

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getSheet_();
    ensureHeaders_(sheet);
    if (submissionId && wasSubmitted_(sheet, submissionId)) {
      return respond_({success:true, status:'success', duplicate:true, message:'This quote was already received.'});
    }
    const row = [new Date(), submissionId, safeCell_(name), safeCell_(phone), safeCell_(email), safeCell_(location), safeCell_(projectType), safeCell_(service), safeCell_(budget), safeCell_(requirement), 'Saved'];
    sheet.appendRow(row);
    const savedRow = sheet.getLastRow();
    let notificationStatus = 'Saved';
    if (CONFIG.SEND_EMAIL_NOTIFICATION && CONFIG.NOTIFY_EMAIL) {
      try {
        GmailApp.sendEmail(CONFIG.NOTIFY_EMAIL, `New detailed quote enquiry — ${name}`, [
          'A new detailed quote was submitted on Vaazhvizhi Contracters website.', '',
          `Name: ${name}`, `Phone: ${phone}`, `Email: ${email || 'Not provided'}`,
          `Location: ${location}`, `Project type: ${projectType}`, `Service: ${service}`,
          `Budget: ${budget || 'Not provided'}`, '', 'Requirements:', requirement
        ].join('\n'));
        notificationStatus = 'Saved - Email Sent';
      } catch (mailError) {
        notificationStatus = 'Saved - Email Failed';
      }
      sheet.getRange(savedRow, HEADERS.length).setValue(notificationStatus);
    }
    return respond_({success:true, status:'success', message:'Detailed quote saved successfully.', submissionId:submissionId, notificationStatus:notificationStatus});
  } catch (err) {
    return respond_({success:false, message:'Could not save the quote. Please try again later.'});
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('Vaazhvizhi Contracters detailed quote endpoint is active. Submit the detailed quote form from the website.');
}
function getSheet_() {
  const ss = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet is connected. Bind this script to the destination spreadsheet or set SPREADSHEET_ID.');
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) return sheet;
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getDisplayValues()[0];
  const matches = HEADERS.every((header, index) => String(existing[index] || '') === header);
  if (matches) return sheet;
  // Keep any legacy rows/columns intact. Use a clean detailed-quote tab rather than
  // silently appending a new schema under old or missing column headings.
  let detailed = ss.getSheetByName('Detailed Quotes');
  if (!detailed) detailed = ss.insertSheet('Detailed Quotes');
  if (detailed.getLastRow() > 0) {
    const detailedHeaders = detailed.getRange(1, 1, 1, Math.max(detailed.getLastColumn(), HEADERS.length)).getDisplayValues()[0];
    const detailedMatches = HEADERS.every((header, index) => String(detailedHeaders[index] || '') === header);
    if (!detailedMatches) throw new Error('The Detailed Quotes tab has a different header layout. Please review it before accepting new quotes.');
  }
  return detailed;
}
function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}
function wasSubmitted_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const values = sheet.getRange(2, 2, last - 1, 1).getDisplayValues();
  return values.some(row => row[0] === id);
}
function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLength);
}
function safeCell_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}
function respond_(payload) {
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><body><script>(function(){var result=${json};try{parent.postMessage({type:'vaazhvizhiQuoteResult',formType:'Detailed Quote',success:result.success,status:result.status,message:result.message,duplicate:result.duplicate,notificationStatus:result.notificationStatus},'*');}catch(e){}document.body.textContent=result.message||'Request processed';})();</script></body></html>`;
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
