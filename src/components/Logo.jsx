/**
 * Logo placeholder — a monogram + wordmark until the final logo is supplied.
 * Replace the <svg> with the real logo file when available.
 */
export default function Logo({ light = false, className = '' }) {
  const ink = light ? 'text-white' : 'text-charcoal';
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="Alliance International">
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke="#B49A68" strokeWidth="1" />
        <circle cx="24" cy="24" r="19" fill="none" stroke="#B49A68" strokeOpacity=".35" strokeWidth=".75" />
        <text
          x="24"
          y="30.5"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="18"
          fontWeight="500"
          letterSpacing="1"
          fill="currentColor"
          className={ink}
        >
          AI
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.35rem] font-medium tracking-[0.02em] ${ink}`}>Alliance</span>
        <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.42em] ${light ? 'text-white/70' : 'text-charcoal/50'}`}>
          International
        </span>
      </span>
    </span>
  );
}
