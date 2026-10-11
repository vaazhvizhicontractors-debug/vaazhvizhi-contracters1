(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const WHATSAPP_NUMBER = '919025541161';

  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
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
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('a', nav).forEach(link =>
      link.addEventListener('click', closeMenu)
    );

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Enquiry choice: initially hide both forms.
  const formsGrid = $('.forms-grid');
  const quickCard = $('#quickForm');
  const detailedCard = $('#detailedForm');
  const enquirySection = $('#enquiry');

  function hideEnquiryForms(scrollToChoices = false) {
    if (!formsGrid || !quickCard || !detailedCard) return;

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
    if (!formsGrid || !quickCard || !detailedCard) return;

    formsGrid.classList.add('is-visible');
    quickCard.hidden = which !== 'quick';
    detailedCard.hidden = which !== 'detailed';

    const target = which === 'quick' ? quickCard : detailedCard;

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 30);
  }

  hideEnquiryForms();

  $$('a[href="#quickForm"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showEnquiry('quick');
    });
  });

  $$('a[href="#detailedForm"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showEnquiry('detailed');
    });
  });

  // Add a switch-back button to both forms.
  [quickCard, detailedCard].forEach(card => {
    if (!card || $('.enquiry-switch', card)) return;

    const switchButton = document.createElement('button');
    switchButton.type = 'button';
    switchButton.className = 'enquiry-switch';
    switchButton.textContent = '← Choose a different enquiry option';

    switchButton.addEventListener('click', () => {
      hideEnquiryForms(true);
    });

    const heading = $('.form-heading', card);
    if (heading) heading.appendChild(switchButton);
  });

  // Project cards select a project and open Detailed Quote.
  $$('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const projectType = $('#projectType');

      if (projectType) {
        projectType.value = card.dataset.project || '';
      }

      showEnquiry('detailed');
    });
  });

  // QUICK ENQUIRY: WhatsApp only.
  // This form does not submit to Apps Script or Google Sheets.
  const quickForm = $('#quickEnquiryForm');

  if (quickForm) {
    quickForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = ($('#quickName')?.value || '').trim();
      const service = ($('#quickService')?.value || '').trim();
      const message = ($('#quickMessage')?.value || '').trim();
      const error = $('#quickError');

      if (error) error.textContent = '';

      if (!name || !service || !message) {
        if (error) {
          error.textContent =
            'Please complete your name, service and message.';
        }

        (!name ? $('#quickName') :
          !service ? $('#quickService') :
            $('#quickMessage'))?.focus();

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

      const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

      const opened = window.open(url, '_blank', 'noopener,noreferrer');

      // If popup is blocked, use the current tab.
      if (!opened) {
        window.location.href = url;
      }
    });
  }

  // DETAILED QUOTE: two-step form.
  const form = $('#detailedQuoteForm');
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

  let submitted = false;
  let completed = false;
  let fallbackTimer = null;

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
        number === 1 ? 'Contact & project' : 'Project requirements';
    }

    if (progress) {
      progress.style.width = number === 1 ? '50%' : '100%';
    }

    if (step1Error) step1Error.textContent = '';
    if (step2Error) step2Error.textContent = '';

    if (focus) {
      const target = number === 1 ? $('#quoteName') : $('#quoteBudget');
      target?.focus({ preventScroll: true });
    }
  }

  function validStep(number) {
    const step = steps.find(
      item => Number(item.dataset.step) === number
    );

    const error = number === 1 ? step1Error : step2Error;

    if (!step) return true;
    if (error) error.textContent = '';

    const fields = $$(
      'input[required], select[required], textarea[required]',
      step
    );

    for (const field of fields) {
      if (!String(field.value || '').trim()) {
        if (error) {
          error.textContent =
            'Please complete the required fields marked *.';
        }

        field.focus();
        return false;
      }

      if (field.type === 'tel') {
        const digits = field.value.replace(/\D/g, '');

        if (digits.length < 10 || digits.length > 15) {
          if (error) {
            error.textContent =
              'Enter a valid mobile number (10–15 digits).';
          }

          field.focus();
          return false;
        }
      }

      if (field.type === 'email' &&
          field.value.trim() &&
          !field.validity.valid) {
        if (error) {
          error.textContent = 'Please enter a valid email address.';
        }

        field.focus();
        return false;
      }
    }

    return true;
  }

  next?.addEventListener('click', () => {
    if (validStep(1)) showStep(2);
  });

  back?.addEventListener('click', () => showStep(1));

  function setSubmitBusy(busy) {
    if (!submit) return;

    submit.disabled = busy;
    submit.textContent = busy
      ? 'Submitting…'
      : 'Submit detailed quote ↗';
  }

  // Receive Apps Script result.
  // Submission ID must match the currently submitted form.
  window.addEventListener('message', event => {
    if (!submitted || completed) return;
    if (!event.data || typeof event.data !== 'object') return;

    const data = event.data;
    const currentId = $('#submissionId')?.value || '';

    if (data.type !== 'vaazhvizhiQuoteResult') return;
    if (!currentId || data.submissionId !== currentId) return;

    completed = true;
    submitted = false;

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
    }

    setSubmitBusy(false);

    if (data.success === true) {
      form.reset();

      const idField = $('#submissionId');
      if (idField) idField.value = '';

      showStep(1, false);

      if (status) {
        status.textContent =
          'Detailed quote saved successfully. Thank you!';
        status.style.color = '#24866a';
      }
    } else {
      if (status) {
        status.textContent = data.message ||
          'The quote was not confirmed as saved. Please check the sheet before retrying.';
        status.style.color = '#b42318';
      }
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    // Validate step 1 first so focus never jumps to a hidden field.
    if (!validStep(1)) {
      showStep(1, false);
      return;
    }

    if (!validStep(2)) {
      showStep(2, false);
      return;
    }

    const honeypot = $('#website');

    if (honeypot && honeypot.value.trim()) return;
    if (submitted) return;

    const idField = $('#submissionId');

    // Reuse the same ID when retrying after a timeout.
    if (idField && !idField.value) {
      idField.value = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : `vq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    submitted = true;
    completed = false;

    if (status) {
      status.textContent =
        'Submitting detailed quote… Please wait and do not refresh this page.';
      status.style.color = '#245b92';
    }

    setSubmitBusy(true);

    // POST to Apps Script using the hidden iframe.
    // This avoids fetch CORS restrictions for the cross-origin endpoint.
    HTMLFormElement.prototype.submit.call(form);

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
    }

    fallbackTimer = window.setTimeout(() => {
      if (completed) return;

      submitted = false;
      setSubmitBusy(false);

      if (status) {
        status.textContent =
          'We could not confirm the result automatically. Check the Google Sheet before retrying. If you retry, the same submission ID is reused to help prevent duplicate rows.';
        status.style.color = '#946200';
      }
    }, 15000);
  });
})();
