(() => {
  const site = document.getElementById('iym-site');
  if (!site) return;

  if (!site.classList.contains('inner-page')) {
    const header = site.querySelector('.site-header');
    const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', syncHeader, {passive: true});
    syncHeader();
  }

  const heroImage = document.getElementById('v2-hero-image');
  const heroMedia = heroImage?.parentElement;
  const heroImages = [
    'assets/hero-real-01.webp',
    'assets/hero-real-03.webp',
    'assets/hero-real-16.webp',
    'assets/hero-real-05.webp',
    'assets/hero-real-06.webp',
    'assets/hero-real-07.webp',
    'assets/hero-real-09.webp',
    'assets/hero-real-10.webp',
    'assets/hero-real-11.webp',
    'assets/hero-real-12.webp',
    'assets/hero-real-13.webp',
    'assets/hero-real-14.webp',
    'assets/hero-real-15.webp'
  ];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = true;
  let imageIndex = 0;
  let cycleTimer;
  let fadeTimer;

  let nextImage;

  function preloadNextImage() {
    if (!heroImage || nextImage?.src.endsWith(heroImages[(imageIndex + 1) % heroImages.length])) return;
    nextImage = new Image();
    nextImage.src = heroImages[(imageIndex + 1) % heroImages.length];
  }

  function canMove() {
    return !motionPreference.matches && !document.hidden && heroVisible;
  }

  function scheduleImage() {
    window.clearTimeout(cycleTimer);
    if (heroImage && canMove()) {
      preloadNextImage();
      cycleTimer = window.setTimeout(advanceImage, 6500);
    }
  }

  function advanceImage() {
    if (!heroImage || !heroMedia || !canMove()) return;
    if (!nextImage?.complete || !nextImage.naturalWidth) {
      scheduleImage();
      return;
    }
    heroMedia.classList.add('is-dimming');
    fadeTimer = window.setTimeout(() => {
      imageIndex = (imageIndex + 1) % heroImages.length;
      heroImage.src = heroImages[imageIndex];
      nextImage = undefined;
      heroMedia.classList.remove('is-dimming');
      fadeTimer = undefined;
      scheduleImage();
    }, 650);
  }

  function syncMotion() {
    const moving = canMove();
    site.classList.toggle('v2-motion-paused', !moving);
    window.clearTimeout(cycleTimer);
    if (fadeTimer) {
      window.clearTimeout(fadeTimer);
      fadeTimer = undefined;
      heroMedia?.classList.remove('is-dimming');
    }
    if (moving) scheduleImage();
  }

  document.addEventListener('visibilitychange', syncMotion);
  motionPreference.addEventListener?.('change', syncMotion);
  if (heroImage && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0]?.isIntersecting ?? true;
      syncMotion();
    }, {threshold: 0.05}).observe(heroImage);
  }
  syncMotion();
})();
