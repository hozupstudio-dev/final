/* BEHIND THE SCENE — spatial transition: open the door, dolly through it,
 * then reveal the interior behind-the-scenes gallery. Clips open in a
 * lightbox player (gracefully shows the poster if the file is absent).
 */
(function () {
  const facade = document.getElementById('facade');
  const door = document.getElementById('doorPanel');
  const interior = document.getElementById('interior');
  const exitBtn = document.getElementById('exitBtn');

  let entered = false;

  function enter() {
    if (entered) return;
    entered = true;

    // 1) swing the door open
    facade.classList.add('open');

    // 2) after the swing, dolly the camera through the opening
    setTimeout(() => facade.classList.add('enter'), 700);

    // 3) hide facade, reveal interior
    setTimeout(() => {
      facade.style.display = 'none';
      interior.classList.add('show');
      exitBtn.style.display = 'inline-flex';
      window.scrollTo({ top: 0 });
    }, 1850);
  }

  door.addEventListener('click', enter);
  door.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); }
  });

  exitBtn.addEventListener('click', () => {
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
    lightbox.classList.add('show');
    const p = lbVideo.play();
    if (p && p.catch) p.catch(() => {}); // missing file / autoplay block is fine
  }
  function closeClip() {
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    lightbox.classList.remove('show');
  }

  document.querySelectorAll('.clip').forEach((clip) => {
    clip.addEventListener('click', () =>
      openClip(clip.dataset.video, clip.dataset.title));
  });
  lbClose.addEventListener('click', closeClip);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeClip(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeClip(); });
})();
