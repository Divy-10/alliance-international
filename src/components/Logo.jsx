export default function Logo({ light = false, className = '', height = 'h-9 sm:h-10' }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="Alliance International">
      <img
        src={light ? '/images/logo-light.png' : '/images/logo-dark.png'}
        alt="Alliance International"
        className={`${height} w-auto object-contain transition-opacity duration-300`}
        loading="eager"
        decoding="sync"
      />
    </span>
  );
}
