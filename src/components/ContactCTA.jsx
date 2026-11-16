import Button from './Button.jsx';
import Reveal from './Reveal.jsx';

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Fine concentric line motif */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-56 h-[640px] w-[640px] text-gold/15"
        viewBox="0 0 400 400"
      >
        {[60, 100, 140, 180].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth=".6" />
        ))}
      </svg>
      <div className="container-x relative py-24 md:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Partner With Us</p>
          <h2 className="display-2 mt-6 !text-white">Let&rsquo;s Build a Trusted Global Partnership.</h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-8 text-white/60">
            Share your commodity requirements and our team will get back to you.
          </p>
          <div className="mt-12">
            <Button to="/contact" variant="gold">
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
