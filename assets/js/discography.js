/* DISCOGRAPHY — full-screen video deck.
 * Each album fills the viewport; scrolling snaps to the next one and its
 * title-chorus video (with audio) auto-plays from the hook timestamp.
 */
(function () {
  const deck = document.getElementById('deck');
  const albums = Array.from(deck.querySelectorAll('.album'));

  // apply central media manifest (assets/js/media.js) if present
  const cfg = (window.MEDIA && window.MEDIA.discography) || [];
  albums.forEach((a, i) => {
    const c = cfg[i];
    if (!c) return;
    const v = a.querySelector('video');
    const lg = a.querySelector('.logo');
    if (c.video) v.dataset.src = c.video;
    if (c.logo) lg.src = c.logo;
    if (c.start != null) a.dataset.start = String(c.start);
  });
  const dotsWrap = document.getElementById('dots');
  const cue = document.getElementById('scrollCue');
  let soundOn = false;
  let active = null;

  // build progress dots
  albums.forEach((a, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', '앨범 ' + (i + 1));
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () =>
      a.scrollIntoView({ behavior: 'smooth' }));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function ensureSrc(v) { if (!v.src && v.dataset.src) v.src = v.dataset.src; }

  function play(album) {
    if (active === album) return;
    if (active) stop(active);

    const video = album.querySelector('video');
    ensureSrc(video);
    const start = parseFloat(album.dataset.start || '0');

    const begin = () => {
      // jump to the chorus hook, but never past the end of the clip
      const d = video.duration;
      if (start && isFinite(d) && start < d - 1 && video.currentTime < start) {
        try { video.currentTime = start; } catch (e) {}
      }
      video.muted = !soundOn;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    if (video.readyState >= 1) begin();
    else video.addEventListener('loadedmetadata', begin, { once: true });

    album.classList.add('playing', 'in-view');
    active = album;

    // sync dots
    const idx = parseInt(album.dataset.dot, 10);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function stop(album) {
    album.querySelector('video').pause();
    album.classList.remove('playing');
  }

  // observe which album fills the screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        e.target.classList.add('in-view');
        play(e.target);
      }
    });
  }, { threshold: [0, 0.6, 0.9] });
  albums.forEach((a) => io.observe(a));

  // hide the scroll cue once the user leaves the first screen
  deck.addEventListener('scroll', () => {
    cue.style.opacity = deck.scrollTop > 60 ? '0' : '1';
  }, { passive: true });

  // kick off the first video
  play(albums[0]);

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

  document.addEventListener('visibilitychange', () => {
    if (!active) return;
    const v = active.querySelector('video');
    if (document.hidden) v.pause();
    else { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  });
})();
