/* BEHIND THE SCENE — knock to open the door, dolly through it into the
 * interior, then show the behind-the-scenes YouTube clips (from
 * window.MEDIA.behind). Real video titles are fetched in the browser via
 * noembed (CORS-friendly); clicking a clip plays it in a lightbox.
 */
(function () {
  const facade = document.getElementById('facade');
  const door = document.getElementById('doorPanel');
  const interior = document.getElementById('interior');
  const exitBtn = document.getElementById('exitBtn');
  const featured = document.getElementById('featured');
  const grid = document.getElementById('grid');
  let entered = false, built = false;

  const clips = (window.MEDIA && window.MEDIA.behind) || [];

  function thumb(id) { return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }

  // Build the clip cards. First clip is the large feature, the rest go in the grid.
  function buildClips() {
    if (built) return; built = true;
    clips.forEach((c, i) => {
      const isFeat = i === 0;
      const el = document.createElement('div');
      el.className = 'clip ' + (isFeat ? 'feature-clip' : 'mini-clip');
      el.dataset.id = c.id;
      el.dataset.title = c.label || ('Behind Clip ' + (i + 1));
      el.innerHTML =
        '<img class="thumb" src="' + thumb(c.id) + '" alt="" ' +
          'onerror="this.src=\'https://i.ytimg.com/vi/' + c.id + '/mqdefault.jpg\'">' +
        '<div class="grad"></div>' +
        (isFeat ? '<span class="tag-tl">BEHIND</span>' : '') +
        '<span class="play-circle">▶</span>' +
        '<div class="cap"><b class="cap-title">' + el.dataset.title + '</b></div>';
      el.addEventListener('click', () => openClip(c.id, el.dataset.title));
      (isFeat ? featured : grid).appendChild(el);

      // fetch the real YouTube title and update the label
      fetchTitle(c.id).then((t) => {
        if (!t) return;
        el.dataset.title = t;
        const cap = el.querySelector('.cap-title');
        if (cap) cap.textContent = t;
      });
    });
  }

  function fetchTitle(id) {
    const url = 'https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id;
    return fetch(url).then((r) => r.json()).then((d) => d && d.title).catch(() => null);
  }

  function enter() {
    if (entered) return;
    entered = true;
    facade.classList.add('open');
    setTimeout(() => facade.classList.add('enter'), 700);
    setTimeout(() => {
      facade.style.display = 'none';
      interior.classList.add('show');
      exitBtn.style.display = 'inline-flex';
      buildClips();
      window.scrollTo({ top: 0 });
    }, 1850);
  }

  door.addEventListener('click', enter);
  door.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });

  exitBtn.addEventListener('click', () => {
    interior.classList.remove('show');
    exitBtn.style.display = 'none';
    facade.style.display = 'flex';
    facade.classList.remove('open', 'enter');
    entered = false;
  });

  // ---- lightbox (YouTube iframe) ----
  const lightbox = document.getElementById('lightbox');
  const lbFrame = document.getElementById('lbFrame');
  const lbTitle = document.getElementById('lbTitle');
  const lbClose = document.getElementById('lbClose');
  const lbOpen = document.getElementById('lbOpen');

  function openClip(id, title) {
    lbTitle.textContent = title || 'Behind Clip';
    lbOpen.href = 'https://www.youtube.com/watch?v=' + id;   // fallback if embedding is blocked
    // standard youtube.com/embed (avoids the nocookie config error 153),
    // autoplay within this click gesture + playsinline; pass origin when on http(s)
    const origin = location.protocol.indexOf('http') === 0
      ? '&origin=' + encodeURIComponent(location.origin) : '';
    const src = 'https://www.youtube.com/embed/' + id +
      '?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1' + origin;
    lbFrame.innerHTML = '<iframe src="' + src + '" title="' + (title || '') +
      '" referrerpolicy="strict-origin-when-cross-origin" ' +
      'allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    lightbox.classList.add('show');
  }
  function closeClip() { lbFrame.innerHTML = ''; lightbox.classList.remove('show'); }

  lbClose.addEventListener('click', closeClip);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeClip(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeClip(); });
})();
