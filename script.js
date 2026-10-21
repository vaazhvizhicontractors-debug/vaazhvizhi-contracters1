(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const WHATSAPP_NUMBER = '919025541161';
  const form = $('#detailedQuoteForm');
  const frame = $('#submissionFrame');
  let submitted = false;
  let completed = false;
  let fallbackTimer = null;

  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuToggle = $('#menuToggle');
  const nav = $('#primaryNav');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // DETAILED QUOTE: the form opens only from the explicit Get Detailed Quote button.
  const formsGrid = $('#quoteForms');
  const detailedCard = $('#detailedForm');
  const openDetailedQuote = $('#openDetailedQuote');
  // Project-type cards may preselect the matching value, but never reveal the form.
  $$('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const projectType = $('#projectType');
      if (projectType) projectType.value = card.dataset.project || '';
    });
  });
  if (openDetailedQuote && formsGrid && detailedCard) {
    openDetailedQuote.addEventListener('click', () => {
      formsGrid.hidden = false;
      formsGrid.classList.add('is-visible');
      detailedCard.hidden = false;
      window.setTimeout(() => detailedCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
    });
  }

  // Detailed quote: two-step validation, then submit only to Apps Script / Sheet.
  if (!form) return;
  const steps = $$('[data-step]', form);
  const next = $('#nextStep');
  const back = $('#backStep');
  const submit = $('#submitQuote');
  const status = $('#quoteStatus');
  const stepLabel = $('#stepLabel');
  const stepTitle = $('#stepTitle');
  const progress = $('#progressBar');
  const step1Error = $('#step1Error');
  const step2Error = $('#step2Error');

  function showStep(number) {
    steps.forEach(step => {
      const active = Number(step.dataset.step) === number;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    if (stepLabel) stepLabel.textContent = `STEP ${number} OF 2`;
    if (stepTitle) stepTitle.textContent = number === 1 ? 'Contact & project' : 'Project requirements';
    if (progress) progress.style.width = number === 1 ? '50%' : '100%';
    if (status) status.textContent = '';
    if (number === 1) $('#quoteName').focus({ preventScroll: true });
    else $('#quoteBudget').focus({ preventScroll: true });
  }

  function validStep(number) {
    const step = steps.find(item => Number(item.dataset.step) === number);
    const error = number === 1 ? step1Error : step2Error;
    if (error) error.textContent = '';
    const fields = $$('input[required], select[required], textarea[required]', step);
    for (const field of fields) {
      if (!field.value.trim()) {
        if (error) error.textContent = 'Please complete the required fields marked *.';
        field.focus();
        return false;
      }
      if (field.type === 'tel') {
        const digits = field.value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          if (error) error.textContent = 'Enter a valid mobile number (10–15 digits).';
          field.focus();
          return false;
        }
      }
      if (field.type === 'email' && field.value.trim() && !field.validity.valid) {
        if (error) error.textContent = 'Please enter a valid email address.';
        field.focus();
        return false;
      }
    }
    return true;
  }

  if (next) next.addEventListener('click', () => { if (validStep(1)) showStep(2); });
  if (back) back.addEventListener('click', () => showStep(1));

  function setSubmitBusy(busy) {
    if (!submit) return;
    submit.disabled = busy;
    submit.textContent = busy ? 'Submitting…' : 'Submit detailed quote ↗';
  }

  if (frame) {
    frame.addEventListener('load', () => {
      if (!submitted || completed) return;
      // Cross-origin iframe responses cannot always be read. This fallback confirms
      // the POST navigation occurred, not that a human inspected the spreadsheet.
      if (status && !status.textContent) {
        status.textContent = 'Submission request sent. Please verify the new row in Sheet1; if it is missing, the Apps Script deployment needs checking.';
        status.style.color = '#245b92';
      }
      setSubmitBusy(false);
    });
  }

  // Apps Script's HTML response may notify the parent page when the save completes.
  window.addEventListener('message', event => {
    if (!form || !submitted || completed) return;
    if (frame && event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'VAazhvizhiQuoteResult' || data.type === 'vaazhvizhiQuoteResult' || data.formType === 'Detailed Quote') {
      completed = true;
      submitted = false; // Allow a new enquiry after this response is handled.
      clearTimeout(fallbackTimer);
      setSubmitBusy(false);
      if (data.success === true || data.status === 'success') {
        form.reset();
        const id = $('#submissionId'); if (id) id.value = '';
        showStep(1); // Reset the step before showing the success message.
        if (status) {
          status.textContent = 'Detailed quote saved successfully. Thank you!';
          status.style.color = '#24866a';
        }
      } else if (status) {
        status.textContent = data.message || 'We could not confirm the save. Please check the spreadsheet before submitting again.';
        status.style.color = '#b42318';
      }
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validStep(2)) return;
    if (!validStep(1)) { showStep(1); return; }
    const honeypot = $('#website');
    if (honeypot && honeypot.value.trim()) return;
    if (submitted) return;

    // Include the optional start timeline in the requirement field so backend and
    // Sheet column names stay aligned with the agreed contract.
    const details = $('#quoteDetails');
    const timeline = $('#quoteTimeline');
    if (details && timeline && timeline.value) {
      const marker = `Expected start: ${timeline.value}`;
      if (!details.value.includes(marker)) details.value = `${marker}\n\n${details.value}`.trim();
    }
    const submissionId = $('#submissionId');
    if (submissionId) submissionId.value = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `vq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    submitted = true;
    completed = false;
    if (status) {
      status.textContent = 'Sending your detailed quote to the connected form endpoint…';
      status.style.color = '#245b92';
    }
    setSubmitBusy(true);
    // Native form POST to a hidden iframe avoids browser CORS blocking the write.
    HTMLFormElement.prototype.submit.call(form);
    fallbackTimer = window.setTimeout(() => {
      if (completed) return;
      setSubmitBusy(false);
      if (status) {
        status.textContent = 'The request was sent, but the save could not be verified automatically. Check Sheet1 before trying again.';
        status.style.color = '#9a6700';
      }
      submitted = false;
    }, 10000);
  });
})();
