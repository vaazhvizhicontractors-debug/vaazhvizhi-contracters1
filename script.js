
(() => {
  'use strict';

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const WHATSAPP_NUMBER = '919025541161';

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

      menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

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
  // 3. ENQUIRY FORM VISIBILITY
  // --------------------------------------------------

  const formsGrid = $('.forms-grid');
  const quickCard = $('#quickForm');
  const detailedCard = $('#detailedForm');
  const enquirySection = $('#enquiry');

  function hideEnquiryForms(scrollToChoices = false) {
    if (!formsGrid || !quickCard || !detailedCard) {
      return;
    }

    formsGrid.classList.remove('is-visible');

    quickCard.hidden = true;
    detailedCard.hidden = true;

    if (scrollToChoices && enquirySection) {
      enquirySection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function showEnquiry(which) {
    if (!formsGrid || !quickCard || !detailedCard) {
      return;
    }

    if (which !== 'quick' && which !== 'detailed') {
      return;
    }

    formsGrid.classList.add('is-visible');

    quickCard.hidden = which !== 'quick';
    detailedCard.hidden = which !== 'detailed';

    const target =
      which === 'quick' ? quickCard : detailedCard;

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 30);
  }

  // Both forms are hidden when the page first loads.
  hideEnquiryForms();

  // Quick Enquiry links.
  $$('a[href="#quickForm"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showEnquiry('quick');
    });
  });

  // Detailed Quote links.
  $$('a[href="#detailedForm"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showEnquiry('detailed');
    });
  });

  // Add a switch-back button only when one is missing.
  [quickCard, detailedCard].forEach(card => {
    if (!card) return;

    const existingButton = $(
      '[data-switch-enquiry], .enquiry-switch',
      card
    );

    if (existingButton) {
      existingButton.setAttribute(
        'data-switch-enquiry',
        ''
      );
      return;
    }

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'enquiry-switch';
    button.setAttribute('data-switch-enquiry', '');
    button.textContent =
      '← Back to enquiry choices';

    const heading = $('.form-heading', card);

    if (heading) {
      heading.appendChild(button);
    } else {
      card.appendChild(button);
    }
  });

  // Handle both existing and automatically created buttons.
  $$('[data-switch-enquiry]').forEach(button => {
    button.addEventListener('click', () => {
      hideEnquiryForms(true);
    });
  });

  // --------------------------------------------------
  // 4. PROJECT CARDS
  // --------------------------------------------------

  $$('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const projectType = $('#projectType');

      if (projectType) {
        projectType.value = card.dataset.project || '';

        // Notify any other listeners of the selection.
        projectType.dispatchEvent(
          new Event('change', { bubbles: true })
        );
      }

      showEnquiry('detailed');
    });
  });

  // --------------------------------------------------
  // 5. QUICK ENQUIRY — WHATSAPP ONLY
  // --------------------------------------------------

  const quickForm = $('#quickEnquiryForm');

  if (quickForm) {
    quickForm.addEventListener('submit', event => {
      event.preventDefault();

      const name =
        ($('#quickName')?.value || '').trim();

      const service =
        ($('#quickService')?.value || '').trim();

      const message =
        ($('#quickMessage')?.value || '').trim();

      const error = $('#quickError');

      if (error) {
        error.textContent = '';
      }

      if (!name || !service || !message) {
        if (error) {
          error.textContent =
            'Please complete your name, service and message.';
        }

        const invalidField =
          !name
            ? $('#quickName')
            : !service
              ? $('#quickService')
              : $('#quickMessage');

        invalidField?.focus();

        return;
      }

      const whatsappMessage = [
        'Hello Vaazhvizhi Contracters,',
        '',
        'I have a quick enquiry.',
        `Name: ${name}`,
        `Service / need: ${service}`,
        `Message: ${message}`
      ].join('\n');

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp from the user's submit action.
      // Do not send this form to Google Sheets.
      const whatsappWindow = window.open(
        whatsappURL,
        '_blank'
      );

      if (whatsappWindow) {
        // Prevent the new page from controlling this page.
        whatsappWindow.opener = null;
      } else {
        // Fallback when the browser blocks the new tab.
        window.location.assign(whatsappURL);
      }
    });
  }

  // --------------------------------------------------
  // 6. DETAILED QUOTE — TWO-STEP FORM
  // --------------------------------------------------

  const form = $('#detailedQuoteForm');

  if (!form) return;

  // Our JavaScript handles validation across both steps.
  // This avoids native validation stopping on hidden fields.
  form.noValidate = true;

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

  const submissionFrame =
    $('iframe[name="submissionFrame"]') ||
    $('#submissionFrame');

  let submitted = false;
  let completed = false;
  let fallbackTimer = null;

  // Set a status message with an optional visual state.
  function setStatus(message, color = '') {
    if (!status) return;

    status.textContent = message;

    if (color) {
      status.style.color = color;
    }
  }

  // --------------------------------------------------
  // 7. STEP DISPLAY
  // --------------------------------------------------

  function showStep(number, focus = true) {
    steps.forEach(step => {
      const isActive =
        Number(step.dataset.step) === number;

      step.hidden = !isActive;
      step.classList.toggle('is-active', isActive);
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
      progress.style.width =
        number === 1 ? '50%' : '100%';
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
  // 8. VALIDATION
  // --------------------------------------------------

  function validStep(number) {
    const step = steps.find(
      item => Number(item.dataset.step) === number
    );

    const error =
      number === 1 ? step1Error : step2Error;

    if (!step) return true;

    if (error) {
      error.textContent = '';
    }

    // Include optional fields too, so optional email
    // is validated when the user has entered an address.
    const fields = $$(
      'input, select, textarea',
      step
    );

    for (const field of fields) {
      if (
        field.disabled ||
        field.type === 'hidden' ||
        field.type === 'submit' ||
        field.type === 'button'
      ) {
        continue;
      }

      const value = String(field.value || '').trim();

      if (field.required && !value) {
        if (error) {
          error.textContent =
            'Please complete the required fields marked *.';
        }

        field.focus();
        return false;
      }

      // Validate a supplied email, even when optional.
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

      // Validate phone number when provided.
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

      // Check other HTML constraints such as minlength,
      // maxlength and pattern where applicable.
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

  next?.addEventListener('click', () => {
    if (validStep(1)) {
      showStep(2);
    }
  });

  back?.addEventListener('click', () => {
    showStep(1);
  });

  // --------------------------------------------------
  // 9. SUBMIT BUTTON STATE
  // --------------------------------------------------

  function setSubmitBusy(busy) {
    if (!submit) return;

    submit.disabled = busy;

    submit.textContent = busy
      ? 'Submitting…'
      : 'Submit detailed quote ↗';
  }

  // --------------------------------------------------
  // 10. APPS SCRIPT RESPONSE
  // --------------------------------------------------

  window.addEventListener('message', event => {
    if (!submitted || completed) return;

    // Accept messages only from our submission iframe.
    if (
      !submissionFrame ||
      event.source !== submissionFrame.contentWindow
    ) {
      return;
    }

    if (
      !event.data ||
      typeof event.data !== 'object'
    ) {
      return;
    }

    const data = event.data;
    const currentId =
      $('#submissionId')?.value || '';

    if (data.type !== 'vaazhvizhiQuoteResult') {
      return;
    }

    if (
      !currentId ||
      data.submissionId !== currentId
    ) {
      return;
    }

    completed = true;
    submitted = false;

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    setSubmitBusy(false);

    if (data.success === true) {
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
  // 11. DETAILED FORM SUBMISSION
  // --------------------------------------------------

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (submitted) return;

    // Validate step 1 first.
    if (!validStep(1)) {
      showStep(1, false);
      return;
    }

    // Then validate step 2.
    if (!validStep(2)) {
      showStep(2, false);
      return;
    }

    // Honeypot spam check.
    const honeypot = $('#website');

    if (honeypot && honeypot.value.trim()) {
      // Do not submit a likely bot entry.
      return;
    }

    // The named iframe is required for this submission method.
    if (!submissionFrame) {
      setStatus(
        'Submission setup error: the submission iframe is missing. Please contact us directly.',
        '#b42318'
      );

      return;
    }

    // Ensure the form has an Apps Script destination.
    if (!form.action) {
      setStatus(
        'Submission setup error: the form endpoint is missing.',
        '#b42318'
      );

      return;
    }

    const idField = $('#submissionId');

    // Reuse the ID after a timeout to help the backend
    // detect retries of the same submission.
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
      fallbackTimer = null;
    }

    // Send the form to Apps Script through the hidden iframe.
    // This is not the Quick Enquiry / WhatsApp route.
    try {
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

    // A timeout means confirmation was not received;
    // it does NOT prove that the sheet write failed.
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
  // 12. INITIAL DETAILED FORM STATE
  // --------------------------------------------------

  showStep(1, false);

})();
