
:root {
  --blue: #123d72;
  --blue-deep: #0b2850;
  --accent: #2865a6;
  --accent-soft: #eaf2fc;
  --white: #fff;
  --bg: #f5f9fd;
  --ink: #172b43;
  --muted: #63748a;
  --line: #dbe5ef;
  --shadow: 0 18px 48px rgba(18, 61, 114, .09);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 94px; }
body {
  margin: 0;
  background: var(--white);
  color: var(--ink);
  font: 16px/1.65 Inter, "Segoe UI", Arial, sans-serif;
}
body, input, select, textarea, button {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
button { cursor: pointer; }
svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.section { scroll-margin-top: 90px; }
.section-pad { padding: clamp(58px, 7vw, 100px) clamp(18px, 7vw, 100px); }

/* Header and navigation */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 25px;
  min-height: 78px;
  padding: 13px clamp(18px, 5vw, 76px);
  background: rgba(255,255,255,.96);
  border-bottom: 1px solid rgba(219,229,239,.8);
  backdrop-filter: blur(16px);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-weight: 700;
  letter-spacing: -.35px;
}
.brand b { color: var(--accent); }
.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: var(--blue);
  color: white;
  font: 700 1.4rem Georgia, serif;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(13px, 2vw, 27px);
  margin-left: auto;
}
.nav-links a { color: #465d76; font-size: .88rem; font-weight: 600; }
.nav-links a:hover, .nav-links a:focus-visible { color: var(--accent); }
.header-cta {
  padding: 10px 15px;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: .88rem;
  font-weight: 700;
  white-space: nowrap;
}
.header-cta span { color: #a7e3ca; }
.menu-toggle {
  display: none;
  width: 42px;
  height: 42px;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;
}
.menu-toggle span {
  display: block;
  height: 2px;
  margin: 4px 0;
  background: var(--blue);
}

/* Hero title and buttons */
.hero {
  display: grid;
  grid-template-columns: 1.02fr .98fr;
  align-items: center;
  gap: clamp(28px, 5vw, 72px);
  min-height: 620px;
  padding: clamp(50px, 7vw, 94px) clamp(18px, 7vw, 100px);
  background: linear-gradient(120deg, #fff 0%, #f5f9fe 100%);
}
.hero-copy { max-width: 650px; }
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 17px;
  color: var(--accent);
  font-size: .73rem;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.eyebrow > span {
  width: 26px;
  height: 3px;
  border-radius: 3px;
  background: var(--accent);
}
h1, h2, h3, p { margin-top: 0; }
h1, h2 {
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -1.7px;
  line-height: 1.1;
}
h1 { font-size: clamp(2.7rem, 5.2vw, 5rem); }
.hero-title {
  font-size: clamp(2.05rem, 4.2vw, 3.7rem);
  line-height: 1.35;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}
h2 { font-size: clamp(2.15rem, 4vw, 3.55rem); }
h1 em, h2 em { font-style: normal; color: var(--accent); }
.hero-description, .section-intro {
  max-width: 540px;
  color: var(--muted);
  font-size: 1.05rem;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 49px;
  padding: 13px 19px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: .9rem;
  font-weight: 750;
  line-height: 1.35;
  text-align: center;
  transition: transform .2s, background .2s, box-shadow .2s;
}
.button:hover { transform: translateY(-2px); }
.button:focus-visible, a:focus-visible, input:focus-visible,
select:focus-visible, textarea:focus-visible {
  outline: 3px solid #9bc3e8;
  outline-offset: 3px;
}
.button-primary {
  background: var(--accent);
  color: white;
  box-shadow: 0 8px 20px rgba(18,61,114,.15);
}
.button-primary:hover { background: #194b80; }
.button-blue { background: var(--blue); color: white; }
.button-blue:hover { background: var(--blue-deep); }
.button-outline { border-color: #bfd0e2; background: white; color: var(--blue); }
.button-full { width: 100%; }

/* Clear house blueprint concept beside the hero title */
.hero-art {
  position: relative;
  isolation: isolate;
  min-height: 430px;
  overflow: hidden;
  border: 1px solid #b8d1e8;
  border-radius: 28px;
  background-color: #f7fbff;
  background-image:
    linear-gradient(rgba(49,105,157,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(49,105,157,.07) 1px, transparent 1px),
    linear-gradient(140deg, #edf6ff, #fff 70%, #e8f5ef);
  background-size: 22px 22px, 22px 22px, auto;
  box-shadow: 0 16px 38px rgba(18,61,114,.12);
}
.art-sun {
  position: absolute;
  top: 45px;
  right: 65px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: #d4e9fa;
  opacity: .75;
}
.hero-blueprint-svg {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 12px;
  overflow: visible;
}
.hero-blueprint-svg text { stroke: none; }
.art-label {
  position: absolute;
  z-index: 2;
  left: 25px;
  bottom: 23px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 13px 16px;
  border: 1px solid #c5d9eb;
  border-radius: 12px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 8px 24px rgba(18,61,114,.12);
}
.art-label span {
  color: #16846c;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.art-label b { color: var(--blue); font-size: .95rem; }

/* Service section */
.service-strip {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 15px;
  flex-wrap: wrap;
  padding: 20px;
  background: var(--blue);
  color: white;
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.service-strip i { color: #b7d0e9; font-style: normal; }
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 35px;
  margin-bottom: 38px;
}
.section-heading h2 { margin-bottom: 0; }
.section-intro { max-width: 390px; margin: 0 0 4px; }
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 16px;
}
.service-card {
  position: relative;
  min-height: 230px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: white;
  transition: transform .2s, border-color .2s, box-shadow .2s;
}
.service-card:hover { transform: translateY(-4px); border-color: #b3cde5; box-shadow: var(--shadow); }
.service-icon {
  display: grid;
  place-items: center;
  width: 49px;
  height: 49px;
  margin-bottom: 24px;
  padding: 11px;
  border-radius: 13px;
  background: #eaf3fc;
  color: var(--blue);
}
.service-card:nth-child(even) .service-icon { background: var(--accent-soft); color: var(--accent); }
.service-icon svg { width: 100%; height: 100%; min-width: 24px; min-height: 24px; stroke-width: 2.2; }
.service-card h3 { max-width: 245px; margin-bottom: 8px; color: var(--blue); font-size: 1.05rem; line-height: 1.3; }
.service-card p { margin: 0; color: var(--muted); font-size: .88rem; }

/* Project cards and process */
.project-section { background: var(--bg); }
.project-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 15px; }
.project-card {
  position: relative;
  display: flex;
  min-height: 225px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  overflow: hidden;
  padding: 23px;
  border: 1px solid #d9e5f1;
  border-radius: 18px;
  background: linear-gradient(150deg,#fff,#edf5fc);
  transition: transform .2s, border-color .2s;
}
.project-card:nth-child(even) { background: linear-gradient(150deg,#fff,#eaf6f0); }
.project-card:hover { transform: translateY(-4px); border-color: #a8c5e2; }
.project-card > svg {
  position: absolute;
  top: 51px;
  right: 22px;
  width: 68px;
  height: 68px;
  color: #6f92b8;
  stroke-width: 1.8;
}
.project-card h3 {
  position: relative;
  z-index: 1;
  max-width: 220px;
  margin: 0 25px 0 0;
  color: var(--blue);
  font-size: 1.14rem;
  line-height: 1.3;
}
.project-arrow { position: absolute; right: 20px; bottom: 20px; color: var(--accent); font-size: 1.3rem; }
.process-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 22px; }
.process-grid article { padding: 25px 25px 10px; border-top: 2px solid var(--line); }
.process-grid article > span {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 22px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 800;
}
.process-grid h3 { margin-bottom: 8px; color: var(--blue); font-size: 1.15rem; }
.process-grid p { color: var(--muted); font-size: .92rem; }

/* Enquiry buttons and quote form */
.enquiry-section { background: linear-gradient(135deg,#f5f9fd,#fff); }
.enquiry-heading { margin-bottom: 22px; }
.enquiry-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin: 24px 0 30px;
}
.enquiry-actions .button { min-width: 210px; justify-content: center; text-align: center; }
.whatsapp-button { background: #16a34a; border-color: #16a34a; color: #fff; }
.whatsapp-button:hover { background: #15803d; border-color: #15803d; }
.forms-grid { display: none !important; grid-template-columns: minmax(0,1fr) !important; }
.forms-grid.is-visible { display: grid !important; }
#detailedForm[hidden], [hidden] { display: none !important; }
#detailedForm { width: 100%; max-width: 760px; margin: 0 auto; scroll-margin-top: 100px; }
.form-card {
  padding: clamp(20px,4vw,36px);
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  box-shadow: var(--shadow);
}
.form-heading h3 { margin-bottom: 16px; color: var(--blue); font-size: 1.45rem; }
.progress-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: var(--muted); font-size: .75rem; font-weight: 750; }
.progress-track { height: 7px; overflow: hidden; border-radius: 10px; background: #e8eef5; }
.progress-track span { display: block; width: 50%; height: 100%; border-radius: 10px; background: var(--accent); transition: width .25s; }

/* Two-step progress diagram */
.quote-stepper {
  display: grid;
  grid-template-columns: minmax(0,1fr) 34px minmax(0,1fr);
  align-items: center;
  gap: 8px;
  margin: 18px 0 24px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #f8fbff;
}
.quote-step { display: flex; align-items: center; gap: 10px; min-width: 0; color: var(--muted); }
.quote-step-number {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 2px solid #cbd8e7;
  border-radius: 50%;
  background: #fff;
  color: #52677e;
  font-weight: 800;
}
.quote-step-copy { display: grid; min-width: 0; line-height: 1.35; }
.quote-step-copy strong { color: #52677e; font-size: .78rem; }
.quote-step-copy small { margin-top: 3px; color: var(--muted); font-size: .68rem; }
.quote-step.is-current .quote-step-number,
.quote-step.is-complete .quote-step-number { border-color: var(--blue); background: var(--blue); color: #fff; }
.quote-step.is-current .quote-step-copy strong,
.quote-step.is-complete .quote-step-copy strong { color: var(--blue); }
.quote-step-connector { height: 2px; border-radius: 2px; background: #d6e1ed; }
.quote-step-connector.is-complete { background: var(--blue); }

.field { display: grid; gap: 7px; margin-bottom: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.field label { color: #304a65; font-size: .85rem; font-weight: 700; }
.field label b { color: #c43c45; }
.field input, .field select, .field textarea {
  width: 100%;
  min-width: 0;
  padding: 12px 13px;
  border: 1px solid #cedbe8;
  border-radius: 10px;
  background: #fbfdff;
  color: var(--ink);
  outline: none;
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(40,101,166,.12);
}
.field textarea { resize: vertical; }
.field-hint { margin: -7px 0 18px; color: var(--muted); font-size: .78rem; }
.form-error { min-height: 0; margin: 0 0 10px; color: #b42318; font-size: .82rem; }
.form-status { margin: 12px 0 0; color: var(--accent); font-size: .88rem; font-weight: 650; overflow-wrap: anywhere; }
.form-step[hidden] { display: none !important; }
.form-actions { display: flex; justify-content: space-between; gap: 12px; }
.submission-frame { position: absolute; width: 1px; height: 1px; border: 0; opacity: 0; pointer-events: none; }
.honeypot { position: absolute !important; left: -10000px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }

/* Contact cards and footer */
.contact-section { text-align: center; background: white; }
.contact-section > .eyebrow { justify-content: center; }
.contact-section h2 { margin-bottom: 12px; color: var(--blue); }
.contact-subtitle { margin-bottom: 35px; color: var(--muted); }
.contact-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; text-align: left; }
.contact-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: white;
  transition: transform .2s, border-color .2s;
}
.contact-card:hover { transform: translateY(-3px); border-color: #b3cde5; }
.contact-icon { display: grid; place-items: center; width: 42px; height: 42px; margin-bottom: 16px; padding: 10px; border-radius: 12px; background: #eaf3fc; color: var(--blue); }
.contact-card:nth-child(even) .contact-icon { background: var(--accent-soft); color: var(--accent); }
.contact-icon svg { width: 100%; height: 100%; stroke-width: 2.1; }
.contact-label { margin-bottom: 5px; color: var(--accent); font-size: .67rem; font-weight: 800; letter-spacing: 1.4px; }
.contact-card strong { margin-bottom: 7px; color: var(--blue); font-size: 1.05rem; overflow-wrap: anywhere; }
.contact-link { color: var(--muted); font-size: .8rem; overflow-wrap: anywhere; }
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 25px clamp(18px,5vw,76px);
  border-top: 1px solid var(--line);
  background: #f6f9fc;
}
.footer-brand { font-size: .92rem; }
.footer-brand .brand-mark { width: 32px; height: 32px; font-size: 1.1rem; }
.site-footer p, .site-footer > span { margin: 0; color: var(--muted); font-size: .78rem; }
.floating-whatsapp {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  padding: 14px;
  border: 2px solid white;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  box-shadow: 0 8px 24px rgba(10,55,40,.25);
}
.floating-whatsapp svg { stroke: white; }
.floating-whatsapp:hover { background: #15803d; }

/* Tablet */
@media (max-width: 1050px) {
  .site-header { gap: 15px; }
  .nav-links { gap: 14px; }
  .nav-links a { font-size: .81rem; }
  .services-grid, .project-grid, .contact-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .hero { min-height: 560px; }
}

/* Mobile navigation and layout */
@media (max-width: 780px) {
  .site-header { min-height: 70px; }
  .menu-toggle { display: block; margin-left: auto; }
  .header-cta { display: none; }
  .nav-links {
    position: absolute;
    top: 69px;
    right: 12px;
    left: 12px;
    display: none;
    align-items: stretch;
    gap: 0;
    margin: 0;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: white;
    box-shadow: var(--shadow);
  }
  .nav-links.is-open { display: flex; flex-direction: column; }
  .nav-links a { padding: 12px 14px; border-radius: 8px; font-size: .95rem; }
  .nav-links a:hover { background: var(--bg); }
  .hero { grid-template-columns: 1fr; min-height: unset; padding-top: 55px; }
  .hero-art { min-height: 350px; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 15px; }
  .section-intro { max-width: 600px; }
  .process-grid { grid-template-columns: 1fr; gap: 12px; }
  .process-grid article { padding-top: 20px; }
  .service-strip { font-size: .66rem; letter-spacing: 1.1px; }
  .site-footer { align-items: flex-start; flex-direction: column; gap: 12px; }
}

/* Small mobile screens */
@media (max-width: 520px) {
  .brand { font-size: .91rem; }
  .brand-mark { width: 34px; height: 34px; }
  .hero { padding-top: 42px; padding-bottom: 50px; }
  .hero-art { min-height: 290px; border-radius: 20px; }
  .hero-blueprint-svg { padding: 8px; }
  .art-sun { right: 30px; width: 85px; height: 85px; }
  .art-label { left: 12px; bottom: 12px; padding: 9px 11px; }
  .art-label b { font-size: .82rem; }
  .services-grid, .project-grid, .contact-grid { grid-template-columns: 1fr; }
  .service-card { min-height: 190px; }
  .project-card { min-height: 190px; }
  .field-row { grid-template-columns: 1fr; gap: 0; }
  .form-actions { flex-direction: column-reverse; }
  .form-actions .button { width: 100%; }
  .service-strip { gap: 10px; padding: 17px 12px; }
  .service-strip i { display: none; }
  .contact-card { padding: 19px; }
  .floating-whatsapp { right: 14px; bottom: 14px; width: 50px; height: 50px; }
  .enquiry-actions { align-items: stretch; flex-direction: column; }
  .enquiry-actions .button { width: 100%; }
  .quote-stepper { grid-template-columns: minmax(0,1fr) 16px minmax(0,1fr); gap: 5px; padding: 10px 8px; }
  .quote-step { gap: 6px; }
  .quote-step-number { flex-basis: 29px; width: 29px; height: 29px; font-size: .8rem; }
  .quote-step-copy strong { font-size: .7rem; }
  .quote-step-copy small { font-size: .6rem; }
  .quote-step-connector { min-width: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }
}
