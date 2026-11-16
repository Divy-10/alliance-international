import { useMemo, useState } from 'react';
import { ChevronDown, CircleCheck, Info, LoaderCircle } from 'lucide-react';
import Button from './Button.jsx';
import { API_CONFIG } from '../config/api.js';
import { postEnquiry } from '../services/apiClient.js';

const EMPTY = { name: '', company: '', email: '', phone: '', country: '', product: '', message: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!v.company.trim()) e.company = 'Please enter your company name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && !/^\+?[0-9\s\-().]{7,20}$/.test(v.phone.trim()))
    e.phone = 'Please enter a valid phone number, including country code.';
  if (!v.country.trim()) e.country = 'Please enter your country.';
  if (!v.product.trim()) e.product = 'Please select a product of interest.';
  if (v.message.trim().length < 10) e.message = 'Please share a few details about your requirement (10+ characters).';
  return e;
}

/**
 * Enquiry form.
 * - Demo mode (default): validates and shows a clearly labelled demo confirmation.
 *   Nothing is sent anywhere.
 * - Live mode: when VITE_ENABLE_ENQUIRY_SUBMISSION=true and an Apps Script URL
 *   is configured, enquiries are appended to the "Enquiries" sheet.
 */
export default function ContactForm({ productOptions = [], initialProduct = '' }) {
  const live = API_CONFIG.enquirySubmissionEnabled;
  const [values, setValues] = useState({ ...EMPTY, product: initialProduct });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');

  const options = useMemo(() => {
    const list = [...productOptions];
    if (initialProduct && !list.includes(initialProduct)) list.unshift(initialProduct);
    return [...list, 'Other / Multiple products'];
  }, [productOptions, initialProduct]);

  const set = (k) => (ev) => {
    const next = { ...values, [k]: ev.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(ev) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(found).length) {
      const first = ev.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
      return;
    }
    if (!live) {
      setStatus('success');
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      await postEnquiry(values);
      setStatus('success');
    } catch (err) {
      setServerError(err.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start border border-charcoal/10 bg-white p-10 md:p-14">
        <CircleCheck className="h-10 w-10 text-gold" strokeWidth={1.1} />
        <h3 className="mt-8 text-[2.25rem] leading-tight">Thank you, {values.name.split(' ')[0]}.</h3>
        {live ? (
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-charcoal/70">
            Your enquiry has been received. Our team will review your requirement and respond to {values.email}.
          </p>
        ) : (
          <>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-charcoal/70">
              Your details passed validation. This is a <strong className="font-semibold text-charcoal">demo form</strong>
              — no message has been sent and no data has been stored.
            </p>
            <DemoNotice className="mt-8" />
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setTouched({});
            setStatus('idle');
          }}
          className="mt-10 text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase underline-offset-4 hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  const field = (k) => ({
    id: `f-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    onBlur: blur(k),
    'aria-invalid': touched[k] && errors[k] ? 'true' : 'false',
    'aria-describedby': touched[k] && errors[k] ? `f-${k}-err` : undefined,
    className: 'field-input',
  });

  return (
    <form noValidate onSubmit={onSubmit} className="bg-white p-8 sm:p-10 md:p-14" aria-label="Enquiry form">
      {!live && <DemoNotice className="mb-10" />}

      <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
        <Field label="Name" k="name" required error={touched.name && errors.name}>
          <input type="text" autoComplete="name" placeholder="Your full name" {...field('name')} />
        </Field>
        <Field label="Company Name" k="company" required error={touched.company && errors.company}>
          <input type="text" autoComplete="organization" placeholder="Company" {...field('company')} />
        </Field>
        <Field label="Email Address" k="email" required error={touched.email && errors.email}>
          <input type="email" autoComplete="email" placeholder="name@company.com" {...field('email')} />
        </Field>
        <Field label="Phone Number" k="phone" error={touched.phone && errors.phone}>
          <input type="tel" autoComplete="tel" placeholder="+00 000 000 0000" {...field('phone')} />
        </Field>
        <Field label="Country" k="country" required error={touched.country && errors.country}>
          <input type="text" autoComplete="country-name" placeholder="Country" {...field('country')} />
        </Field>
        <Field label="Product of Interest" k="product" required error={touched.product && errors.product}>
          <div className="relative">
            <select {...field('product')} className="field-input cursor-pointer appearance-none pr-8">
              <option value="">Select a product</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-charcoal/50" strokeWidth={1.5} />
          </div>
        </Field>
        <Field label="Message" k="message" required error={touched.message && errors.message} className="md:col-span-2">
          <textarea
            rows={5}
            placeholder="Tell us about your requirement — quantity, destination, timelines."
            {...field('message')}
            className="field-input resize-y"
          />
        </Field>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-8 border-l-2 border-red-700/70 bg-red-50 px-4 py-3 text-[14px] text-red-800">
          {serverError} Please try again.
        </p>
      )}

      <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-charcoal/50">Fields marked * are required.</p>
        <Button type="submit" disabled={status === 'sending'} arrow={status !== 'sending'}>
          {status === 'sending' ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Sending…
            </span>
          ) : (
            'Submit Enquiry'
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, k, required, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={`f-${k}`} className="field-label">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`f-${k}-err`} className="mt-2 text-[12px] text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

function DemoNotice({ className = '' }) {
  return (
    <div className={`flex gap-3 border border-gold/40 bg-gold/[0.08] px-5 py-4 text-[13px] leading-6 text-charcoal/75 ${className}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
      <p>
        <strong className="font-semibold text-charcoal">Demo form.</strong> This form is not yet connected to a backend.
        Submissions are validated but not sent or stored.
      </p>
    </div>
  );
}
