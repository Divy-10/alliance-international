import SmartImage from './SmartImage.jsx';

/** Full-bleed photographic hero for inner pages. */
export default function PageHero({ eyebrow, title, intro, image, imageAlt = '' }) {
  return (
    <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-black md:min-h-[68vh]">
      <SmartImage src={image} alt={imageAlt} eager fetchPriority="high" dark className="absolute inset-0 -z-10" imgClassName="anim-slow-zoom" />
      {/* Pure black overlay — no green tones */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
      <div className="container-x pt-40 pb-16 md:pb-24">
        <p className="eyebrow anim-fade-up">{eyebrow}</p>
        <h1 className="display-1 anim-fade-up mt-6 max-w-4xl !text-white" style={{ animationDelay: '120ms' }}>
          {title}
        </h1>
        {intro && (
          <p className="anim-fade-up mt-7 max-w-2xl text-[1.0625rem] leading-8 text-white/75" style={{ animationDelay: '240ms' }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
