import SmartImage from './SmartImage.jsx';

/** Full-bleed photographic hero for inner pages. */
export default function PageHero({ eyebrow, title, intro, image, imageAlt = '' }) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-black md:min-h-[68vh]">
      {/* 1. Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <SmartImage
          src={image}
          alt={imageAlt}
          eager
          fetchPriority="high"
          dark
          className="h-full w-full"
          imgClassName="h-full w-full object-cover anim-slow-zoom"
        />
        {/* Transparent dark veil so text is crisp and image remains clearly visible */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
      </div>

      {/* 2. Text Content on top */}
      <div className="container-x relative z-10 pt-40 pb-16 md:pb-24">
        <p className="eyebrow anim-fade-up">{eyebrow}</p>
        <h1 className="display-1 anim-fade-up mt-6 max-w-4xl !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]" style={{ animationDelay: '120ms' }}>
          {title}
        </h1>
        {intro && (
          <p className="anim-fade-up mt-7 max-w-2xl text-[1.0625rem] leading-8 text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ animationDelay: '240ms' }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
