/* DISCOGRAPHY — scroll-synced title chorus auto-play
 * As each album enters the viewport, its title-chorus video plays and
 * (when the user has enabled sound) jumps to the hook timestamp.
 */
(function () {
  const albums = Array.from(document.querySelectorAll('.album'));
  let soundOn = false;
  let active = null;

  // Lazy-attach video sources only when needed (perf)
  function ensureSrc(video) {
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
  }

  function playAlbum(album) {
    const video = album.querySelector('video');
    ensureSrc(video);
    const start = parseFloat(album.dataset.start || '0');

    // jump to the chorus hook moment, then play
    const begin = () => {
      try { if (video.currentTime < start) video.currentTime = start; } catch (e) {}
      video.muted = !soundOn;
      const p = video.play();
      if (p && p.catch) p.catch(() => {}); // ignore autoplay rejection
    };

    if (video.readyState >= 1) begin();
    else video.addEventListener('loadedmetadata', begin, { once: true });

    album.classList.add('playing');
    active = album;
  }

  function stopAlbum(album) {
    const video = album.querySelector('video');
    video.pause();
    album.classList.remove('playing');
    if (active === album) active = null;
  }

  // in-view reveal + dominant-section playback
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle('in-view', e.isIntersecting);
    });
    // pick the most-visible album as the one that plays
    let best = null, bestRatio = 0;
    albums.forEach((a) => {
      const r = a.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const ratio = visible / vh;
      if (ratio > bestRatio) { bestRatio = ratio; best = a; }
    });
    if (best && bestRatio > 0.45 && best !== active) {
      if (active) stopAlbum(active);
      playAlbum(best);
    }
  }, { threshold: [0, 0.25, 0.45, 0.6, 0.8] });

  albums.forEach((a) => io.observe(a));

  // sound toggle
  const toggle = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');
  const label = document.getElementById('soundLabel');
  toggle.addEventListener('click', () => {
    soundOn = !soundOn;
    icon.textContent = soundOn ? '🔊' : '🔇';
    label.textContent = soundOn ? '소리 끄기' : '소리 켜기';
    if (active) {
      const v = active.querySelector('video');
      v.muted = !soundOn;
      if (soundOn) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    }
  });

  // pause everything when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active) active.querySelector('video').pause();
    else if (!document.hidden && active) {
      const p = active.querySelector('video').play(); if (p && p.catch) p.catch(() => {});
    }
  });
})();
