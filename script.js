```javascript
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // --------------------------------------------------
  // 1. FOOTER YEAR
  // --------------------------------------------------
  const year = $('#currentYear');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // --------------------------------------------------
  // 2. MOBILE NAVIGATION
  // --------------------------------------------------
  const menuToggle = $('#menuToggle');
  const nav = $('#primaryNav');

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close menu' : 'Open menu'
      );
    });

    $$('a', nav).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    document.addEventListener('click', event => {
      if (
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------
  // 3. ENQUIRY FLOW
  //
  // Immediate Enquiry:
  // Direct WhatsApp link configured in index.html.
  //
  // Get Detailed Quote:
  // Opens the detailed quote form.
  // Detailed form submission goes to Google Sheets
  // through the configured Google Apps Script endpoint.
  // It does not automatically open WhatsApp.
  // --------------------------------------------------
  const formsGrid = $('#quoteForms');
  const detailedCard = $('#detailedForm');
  const showDetailedButton = $('#showDetailedQuote');

  function hideDetailedQuote() {
    if (!formsGrid || !detailedCard) return;

    detailedCard.hidden = true;
    formsGrid.classList.remove('is-visible');

    showDetailedButton?.setAttribute('aria-expanded', 'false');
  }

  function showDetailedQuote(shouldScroll = true) {
    if (!formsGrid || !detailedCard) return;

    detailedCard.hidden = false;
    formsGrid.classList.add('is-visible');

    showDetailedButton?.setAttribute('aria-expanded', 'true');

    if (shouldScroll) {
      window.setTimeout(() => {
        detailedCard.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 40);
    }
  }

  // Keep the detailed quote form hidden when the page loads.
  hideDetailedQuote();

  showDetailedButton?.addEventListener('click', () => {
    showDetailedQuote(true);
  });

  // Hero or other CTA buttons can use:
  // data-open-detailed-quote
  $$('[data-open-detailed-quote]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showDetailedQuote(true);
    });
  });

  // Project cards can use:
  // data-project="New Construction"
  $$('[data-project]').forEach(card => {
    card.addEventListener('click', event => {
      event.preventDefault();

      const projectType = $('#projectType');

      if (projectType) {
        projectType.value = card.dataset.project || '';

        projectType.dispatchEvent(
          new Event('change', { bubbles: true })
        );
      }

      showDetailedQuote(true);
    });
  });

  // --------------------------------------------------
  // 4. DETAILED QUOTE FORM INITIALIZATION
  // --------------------------------------------------
  const form = $('#detailedQuoteForm');

  // Allow the website to work even if the quote form
  // is not present on a particular page.
  if (!form) return;

  // Validate the visible step manually so fields in a
  // hidden step do not block the visitor from continuing.
  form.noValidate = true;

  const frame = $('#submissionFrame');
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

  let submitted = false;
  let completed = false;
  let fallbackTimer = null;

  // --------------------------------------------------
  // 5. FORM STATUS MESSAGE
  // --------------------------------------------------
  function setStatus(message, color = '') {
    if (!status) return;

    status.textContent = message;

    if (color) {
      status.style.color = color;
    }
  }

  // --------------------------------------------------
  // 6. SHOW STEP 1 OR STEP 2
  // --------------------------------------------------
  function showStep(number, focus = true) {
    steps.forEach(step => {
      const active = Number(step.dataset.step) === number;

      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });

    if (stepLabel) {
      stepLabel.textContent = `STEP ${number} OF 2`;
    }

    if (stepTitle) {
      stepTitle.textContent =
        number === 1
          ? 'Contact & project'
          : 'Project requirements';
    }

    if (progress) {
      progress.style.width = number === 1 ? '50%' : '100%';
    }

    if (step1Error) {
      step1Error.textContent = '';
    }

    if (step2Error) {
      step2Error.textContent = '';
    }

    if (focus) {
      const target =
        number === 1
          ? $('#quoteName')
          : $('#quoteBudget');

      target?.focus({ preventScroll: true });
    }
  }

  // --------------------------------------------------
  // 7. VALIDATE EACH FORM STEP
  // --------------------------------------------------
  function validStep(number) {
    const step = steps.find(
      item => Number(item.dataset.step) === number
    );

    const error =
      number === 1
        ? step1Error
        : step2Error;

    if (!step) return true;

    if (error) {
      error.textContent = '';
    }

    const fields = $$(
      'input, select, textarea',
      step
    );

    for (const field of fields) {
      if (
        field.disabled ||
        ['hidden', 'submit', 'button'].includes(field.type)
      ) {
        continue;
      }

      const value = String(field.value || '').trim();

      // Required field validation.
      if (field.required && !value) {
        if (error) {
          error.textContent =
            'Please complete the required fields marked *.';
        }

        field.focus();
        return false;
      }

      // Telephone number validation.
      if (field.type === 'tel' && value) {
        const digits = value.replace(/\D/g, '');

        if (digits.length < 10 || digits.length > 15) {
          if (error) {
            error.textContent =
              'Enter a valid mobile number (10–15 digits).';
          }

          field.focus();
          return false;
        }
      }

      // Email validation.
      if (
        field.type === 'email' &&
        value &&
        !field.validity.valid
      ) {
        if (error) {
          error.textContent =
            'Please enter a valid email address.';
        }

        field.focus();
        return false;
      }

      // Other HTML constraint validation.
      if (
        value &&
        field.type !== 'email' &&
        field.type !== 'tel' &&
        !field.validity.valid
      ) {
        if (error) {
          error.textContent =
            field.validationMessage ||
            'Please check this field and try again.';
        }

        field.focus();
        return false;
      }
    }

    return true;
  }

  // --------------------------------------------------
  // 8. NEXT AND BACK BUTTONS
  // --------------------------------------------------
  next?.addEventListener('click', () => {
    if (validStep(1)) {
      showStep(2);
    }
  });

  back?.addEventListener('click', () => {
    showStep(1);
  });

  // --------------------------------------------------
  // 9. SUBMIT BUTTON LOADING STATE
  // --------------------------------------------------
  function setSubmitBusy(busy) {
    if (!submit) return;

    submit.disabled = busy;

    submit.textContent = busy
      ? 'Submitting…'
      : 'Submit detailed quote ↗';
  }

  // --------------------------------------------------
  // 10. RECEIVE GOOGLE APPS SCRIPT RESPONSE
  //
  // The Apps Script backend must send a matching
  // postMessage response to the hidden iframe's parent.
  // --------------------------------------------------
  window.addEventListener('message', event => {
    if (!submitted || completed || !frame) return;

    // Accept responses only from our response iframe.
    if (event.source !== frame.contentWindow) return;

    if (
      !event.data ||
      typeof event.data !== 'object'
    ) {
      return;
    }

    const data = event.data;
    const currentId = $('#submissionId')?.value || '';

    // Check response type and submission ID.
    if (data.type !== 'vaazhvizhiQuoteResult') return;
    if (!currentId || data.submissionId !== currentId) return;

    completed = true;
    submitted = false;

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    setSubmitBusy(false);

    if (
      data.success === true ||
      data.status === 'success'
    ) {
      // Reset the form only after confirmed success.
      form.reset();

      const idField = $('#submissionId');

      if (idField) {
        idField.value = '';
      }

      showStep(1, false);

      setStatus(
        'Detailed quote saved successfully. Thank you!',
        '#24866a'
      );
    } else {
      setStatus(
        data.message ||
          'The quote was not confirmed as saved. Please check Google Sheets before retrying.',
        '#b42318'
      );
    }
  });

  // --------------------------------------------------
  // 11. DETAILED QUOTE SUBMISSION
  // --------------------------------------------------
  form.addEventListener('submit', event => {
    event.preventDefault();

    // Prevent duplicate clicks while submitting.
    if (submitted) return;

    // Validate step 1.
    showStep(1, false);

    if (!validStep(1)) {
      return;
    }

    // Validate step 2.
    showStep(2, false);

    if (!validStep(2)) {
      return;
    }

    // Honeypot field for basic spam protection.
    const honeypot = $('#website');

    if (honeypot && honeypot.value.trim()) {
      return;
    }

    // A hidden response iframe is required.
    if (!frame) {
      setStatus(
        'Submission setup error: response iframe is missing.',
        '#b42318'
      );

      return;
    }

    // Ensure the form action points to Google Apps Script.
    if (
      !form.action ||
      !/script\.google\.com\/macros\/s\//.test(form.action)
    ) {
      setStatus(
        'Submission setup error: the Apps Script endpoint is missing or invalid.',
        '#b42318'
      );

      return;
    }

    // Generate a unique submission ID once.
    // Keep the same ID during a retry to help the backend
    // identify duplicate submissions.
    const idField = $('#submissionId');

    if (idField && !idField.value) {
      idField.value =
        window.crypto &&
        typeof window.crypto.randomUUID === 'function'
          ? window.crypto.randomUUID()
          : `vq-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`;
    }

    submitted = true;
    completed = false;

    setStatus(
      'Submitting detailed quote… Please wait and do not refresh this page.',
      '#245b92'
    );

    setSubmitBusy(true);

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
    }

    try {
      // Submit to the hidden iframe instead of navigating
      // away from the website or opening WhatsApp.
      HTMLFormElement.prototype.submit.call(form);
    } catch (error) {
      submitted = false;

      setSubmitBusy(false);

      setStatus(
        'Could not submit the quote. Please try again.',
        '#b42318'
      );

      return;
    }

    // If no backend response arrives, show a warning.
    // This timeout does not prove that saving failed.
    fallbackTimer = window.setTimeout(() => {
      if (completed) return;

      submitted = false;
      setSubmitBusy(false);

      setStatus(
        'We could not confirm the result automatically. Check Google Sheets before retrying. Your submission ID is retained to help prevent duplicate rows.',
        '#946200'
      );
    }, 15000);
  });

  // --------------------------------------------------
  // 12. INITIAL FORM STATE
  // --------------------------------------------------
  // Start at step 1 whenever the form is initialized.
  showStep(1, false);

})();
```
