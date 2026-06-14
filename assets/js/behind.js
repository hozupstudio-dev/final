/* BEHIND THE SCENE — open the door, dolly through it into the interior,
 * then autoplay the inline behind clips. Clicking a clip opens the lightbox.
 */
(function () {
  const facade = document.getElementById('facade');
  const door = document.getElementById('doorPanel');
  const interior = document.getElementById('interior');
  const exitBtn = document.getElementById('exitBtn');
  let entered = false;

  // resolve a clip's source through the central manifest (assets/js/media.js)
  function srcFor(clip) {
    const key = clip.dataset.key;
    return (key && window.MEDIA && window.MEDIA.behind && window.MEDIA.behind[key])
      || clip.dataset.video;
  }

  // lazy-load + softly autoplay the inline preview videos inside the room
  function startPreviews() {
    interior.querySelectorAll('.feature-clip, .mini-clip').forEach((clip) => {
      const v = clip.querySelector('video');
      if (!v) return;
      if (!v.src) v.src = srcFor(clip);
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {}); // poster stays if it can't play
    });
  }
  function stopPreviews() {
    interior.querySelectorAll('video').forEach((v) => v.pause());
  }

  function enter() {
    if (entered) return;
    entered = true;
    facade.classList.add('open');                       // 1) swing door open
    setTimeout(() => facade.classList.add('enter'), 700); // 2) dolly through
    setTimeout(() => {                                    // 3) reveal interior
      facade.style.display = 'none';
      interior.classList.add('show');
      exitBtn.style.display = 'inline-flex';
      startPreviews();
      window.scrollTo({ top: 0 });
    }, 1850);
  }

  door.addEventListener('click', enter);
  door.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); }
  });

  exitBtn.addEventListener('click', () => {
    stopPreviews();
    interior.classList.remove('show');
    exitBtn.style.display = 'none';
    facade.style.display = 'flex';
    facade.classList.remove('open', 'enter');
    entered = false;
  });

  // ---- lightbox clip player ----
  const lightbox = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lbVideo');
  const lbTitle = document.getElementById('lbTitle');
  const lbClose = document.getElementById('lbClose');

  function openClip(src, title) {
    lbTitle.textContent = title || 'Behind Clip';
    lbVideo.src = src;
    lbVideoUnmuteSafe();
    lightbox.classList.add('show');
  }
  function lbVideoUnmuteSafe() {
    lbVideo.muted = false;
    const p = lbVideo.play();
    if (p && p.catch) p.catch(() => { lbVideo.muted = true; lbVideo.play().catch(() => {}); });
  }
  function closeClip() {
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    lightbox.classList.remove('show');
  }

  document.querySelectorAll('.feature-clip, .mini-clip').forEach((clip) => {
    clip.addEventListener('click', () => openClip(srcFor(clip), clip.dataset.title));
  });
  lbClose.addEventListener('click', closeClip);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeClip(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeClip(); });
})();
