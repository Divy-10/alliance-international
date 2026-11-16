import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, intro, align = 'left', light = false, className = '' }) {
  const center = align === 'center';
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <h2 className={`display-2 mt-6 ${light ? '!text-white' : ''}`}>{title}</h2>
      {intro && <p className={`mt-6 ${light ? 'text-white/70' : 'lead'} ${center ? 'mx-auto' : ''} max-w-2xl`}>{intro}</p>}
    </Reveal>
  );
}
