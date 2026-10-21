(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const WHATSAPP_NUMBER = '919025541161';
  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbyMsEAzXdSathCJm2i44CA6lelm6KDYw9MTSRDPxiPriNXhYg2IC0AB5gIE0CYkU5hO/exec';

  // Footer year
  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const nav = $('#primaryNav');

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    };

    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Immediate Enquiry remains a direct WhatsApp link. It does not submit to Sheets.
  // Detailed Quote starts hidden and opens only when requested.
  const detailedPanel = $('#detailedForm');
  const openDetailedButton = $('#showDetailedQuote');
  const detailedForm = $('#detailedQuoteForm');
  const frame = $('#submissionFrame');
  const status = $('#quoteStatus');
  const step1 = $('.form-step[data-step="1"]', detailedForm || document);
  const step2 = $('.form-step[data-step="2"]', detailedForm || document);
  const nextButton = $('#nextStep');
  const backButton = $('#backStep');
  const submitButton = $('#submitQuote');
  const step1Error = $('#step1Error');
  const step2Error = $('#step2Error');
  const progressBar = $('#progressBar');
  const stepLabel = $('#stepLabel');
  const stepTitle = $('#stepTitle');

  function setStatus(message, kind = 'info') {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = kind;
    status.style.color =
      kind === 'error' ? '#b42318' :
      kind === 'success' ? '#24866a' : '#245b92';
  }

  function openDetailedQuote(projectType = '') {
    if (!detailedPanel) return;
    detailedPanel.hidden = false;
    if (openDetailedButton) openDetailedButton.setAttribute('aria-expanded', 'true');

    if (projectType) {
      const projectSelect = $('#projectType');
      if (projectSelect) {
        const matchingOption = [...projectSelect.options].find(
          option => option.text.trim() === projectType
        );
        if (matchingOption) projectSelect.value = matchingOption.value || matchingOption.text;
      }
    }

    showStep(1);
    detailedPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => $('#quoteName')?.focus({ preventScroll: true }), 250);
  }

  function showStep(number) {
    if (!step1 || !step2) return;
    const first = number === 1;
    step1.hidden = !first;
    step2.hidden = first;
    step1.classList.toggle('is-active', first);
    step2.classList.toggle('is-active', !first);

    $$('[data-step-indicator]').forEach(indicator => {
      const current = Number(indicator.dataset.stepIndicator) === number;
      indicator.classList.toggle('is-current', current);
      if (current) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });

    if (stepLabel) stepLabel.textContent = `STEP ${number} OF 2`;
    if (stepTitle) stepTitle.textContent = first ? 'Contact & project' : 'Quote details';
    if (progressBar) progressBar.style.width = first ? '50%' : '100%';
    if (step1Error) step1Error.textContent = '';
    if (step2Error) step2Error.textContent = '';
  }

  if (openDetailedButton) {
    openDetailedButton.addEventListener('click', () => openDetailedQuote());
  }

  $$('[data-open-detailed-quote]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openDetailedQuote();
    });
  });

  // Project-type cards open the detailed form and preselect the matching project.
  $$('[data-project]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openDetailedQuote(link.dataset.project || '');
    });
  });

  function validateStep1() {
    if (step1Error) step1Error.textContent = '';
    const fields = [
      ['#quoteName', 'Please enter your name.'],
      ['#quotePhone', 'Please enter your mobile number.'],
      ['#quoteLocation', 'Please enter the project location.'],
      ['#projectType', 'Please select a project type.'],
      ['#quoteService', 'Please select a service.']
    ];

    for (const [selector, message] of fields) {
      const field = $(selector);
      if (!field || !field.value.trim()) {
        if (step1Error) step1Error.textContent = message;
        field?.focus();
        return false;
      }
    }

    const phone = $('#quotePhone');
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      if (step1Error) step1Error.textContent = 'Please enter a valid phone number (10–15 digits).';
      phone.focus();
      return false;
    }

    const email = $('#quoteEmail');
    if (email && email.value.trim() && !email.validity.valid) {
      if (step1Error) step1Error.textContent = 'Please enter a valid email address.';
      email.focus();
      return false;
    }

    const honeypot = $('#website');
    if (honeypot && honeypot.value.trim()) return false;
    return true;
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (validateStep1()) {
        showStep(2);
        $('#quoteDetails')?.focus();
      }
    });
  }

  if (backButton) {
    backButton.addEventListener('click', () => showStep(1));
  }

  // Detailed Quote posts only to Google Apps Script through the hidden iframe.
  // It never opens WhatsApp and does not use the quick-enquiry path.
  let submitting = false;
  let submissionTimer = null;

  function submitDetailedQuote(event) {
    event.preventDefault();

    if (!detailedPanel || detailedPanel.hidden || !step2 || step2.hidden) return;
    if (submitting) return;
    if (!validateStep1()) {
      showStep(1);
      validateStep1(); // Re-render the validation message after revealing step 1.
      return;
    }

    if (step2Error) step2Error.textContent = '';
    const requirementField = $('#quoteDetails');
    if (!requirementField || !requirementField.value.trim()) {
      if (step2Error) step2Error.textContent = 'Please describe your project requirements.';
      requirementField?.focus();
      return;
    }

    const honeypot = $('#website');
    if (honeypot && honeypot.value.trim()) return;

    const submissionIdField = $('#submissionId');
    const submissionId =
      window.crypto && typeof window.crypto.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `vq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    if (submissionIdField) submissionIdField.value = submissionId;

    const areaValue = $('#buildingArea')?.value.trim() || '';
    const areaUnit = $('#areaUnit')?.value.trim() || 'sq.ft';
    const timeline = $('#quoteTimeline')?.value.trim() || '';
    const details = requirementField.value.trim();
    const requirementParts = [];

    if (areaValue) requirementParts.push(`Building / land area: ${areaValue} ${areaUnit}`);
    if (timeline) requirementParts.push(`Expected start: ${timeline}`);
    requirementParts.push(details);

    // Send only the fields the Code.gs endpoint expects, with area/timeline
    // included in "requirement" so those details are not lost.
    const values = {
      name: $('#quoteName').value.trim(),
      phone: $('#quotePhone').value.trim(),
      email: $('#quoteEmail')?.value.trim() || '',
      location: $('#quoteLocation').value.trim(),
      projectType: $('#projectType').value.trim(),
      service: $('#quoteService').value.trim(),
      budget: $('#quoteBudget')?.value.trim() || '',
      requirement: requirementParts.join('\n\n'),
      submissionId,
      website: ''
    };

    let postForm = document.createElement('form');
    postForm.method = 'POST';
    postForm.action = APPS_SCRIPT_URL;
    postForm.target = frame?.name || 'submissionFrame';
    postForm.acceptCharset = 'UTF-8';
    postForm.hidden = true;

    Object.entries(values).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      postForm.appendChild(input);
    });

    document.body.appendChild(postForm);
    submitting = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting…';
    }
    setStatus('Sending your detailed quote. Please wait…');

    try {
      postForm.submit();
    } catch (error) {
      submitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit detailed quote <span aria-hidden="true">↗</span>';
      }
      setStatus('Could not send the request. Please check your connection and try again.', 'error');
    } finally {
      postForm.remove();
    }

    clearTimeout(submissionTimer);
    submissionTimer = window.setTimeout(() => {
      if (!submitting) return;
      submitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit detailed quote <span aria-hidden="true">↗</span>';
      }
      setStatus(
        'The request was sent, but the save could not be verified automatically. Check your Google Sheet before submitting again.',
        'error'
      );
    }, 15000);
  }

  if (detailedForm) detailedForm.addEventListener('submit', submitDetailedQuote);

  window.addEventListener('message', event => {
    if (frame && event.source !== frame.contentWindow) return;
    if (!event.data || typeof event.data !== 'object') return;

    const data = event.data;
    if (data.type !== 'vaazhvizhiQuoteResult' && data.formType !== 'Detailed Quote') return;

    clearTimeout(submissionTimer);
    submitting = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit detailed quote <span aria-hidden="true">↗</span>';
    }

    if (data.success === true || data.status === 'success') {
      detailedForm?.reset();
      showStep(1);
      setStatus('Your detailed quote was saved successfully. We will contact you soon.', 'success');
    } else {
      setStatus(data.message || 'The quote could not be saved. Please check the form endpoint and Google Sheet.', 'error');
    }
  });

  // Initial state: detailed form hidden; Immediate Enquiry remains a direct WhatsApp link.
  if (detailedPanel) detailedPanel.hidden = true;
  if (openDetailedButton) openDetailedButton.setAttribute('aria-expanded', 'false');
  showStep(1);
})();
