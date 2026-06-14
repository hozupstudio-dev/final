/* ARCHIVE — street-poster tracklist. The song title is a transparent
 * clickable hotspot (.play-hit); clicking it plays that track.
 * Audio comes from window.MEDIA.archive[seed] if set, otherwise a short
 * synthesized motif so the interaction works without uploaded files.
 */
(function () {
  const slider = document.getElementById('slider');
  const np = document.getElementById('nowPlaying');
  const npTitle = document.getElementById('npTitle');
  const npAlbum = document.getElementById('npAlbum');
  const npStop = document.getElementById('npStop');

  let audioCtx = null, synthNodes = [], htmlAudio = null, current = null; // current = <li>

  function getCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }

  // ---- YouTube audio (video kept off-screen, sound only) ----
  let ytPlayer = null, ytReady = false, ytPending = null;
  function parseYouTube(s) {
    if (!s) return null;
    s = String(s).trim();
    let m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;       // bare 11-char id
    return null;
  }
  function loadYTApi() {
    if (window.YT && window.YT.Player) { ytReady = true; return; }
    if (document.getElementById('yt-api')) return;
    const s = document.createElement('script');
    s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = function () {
      ytReady = true;
      if (ytPending) { const v = ytPending; ytPending = null; startYT(v); }
    };
  }
  function startYT(videoId) {
    if (!ytReady) { ytPending = videoId; loadYTApi(); return; }
    if (ytPlayer && ytPlayer.loadVideoById) { ytPlayer.loadVideoById(videoId); ytPlayer.playVideo(); return; }
    ytPlayer = new YT.Player('ytHost', {
      videoId: videoId,
      playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0 },
      events: {
        onReady: (e) => e.target.playVideo(),
        onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) stopAll(); }
      }
    });
  }
  function stopYT() { try { if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo(); } catch (e) {} }

  function stopAll() {
    synthNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
    synthNodes = [];
    if (htmlAudio) { htmlAudio.pause(); htmlAudio = null; }
    stopYT();
    if (current) current.classList.remove('playing');
    current = null;
    np.classList.remove('show');
  }

  function playSynth(seed) {
    const ctx = getCtx();
    const base = 196 + (seed % 8) * 28;
    const scale = [0, 3, 5, 7, 10, 12];
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.0001; master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    for (let i = 0; i < 6; i++) {
      const t = now + i * 0.18;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      const semitone = scale[(seed + i) % scale.length];
      osc.type = i % 2 ? 'triangle' : 'sawtooth';
      osc.frequency.value = base * Math.pow(2, semitone / 12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.24); synthNodes.push(osc);
    }
  }

  function playTrack(btn) {
    stopAll();
    const li = btn.closest('li');
    current = li;
    li.classList.add('playing');
    npTitle.textContent = btn.textContent.trim();
    npAlbum.textContent = btn.closest('.poster').querySelector('h2').textContent.trim().toUpperCase();
    np.classList.add('show');

    const seed = parseInt(btn.dataset.seed || '0', 10);
    const src = window.MEDIA && window.MEDIA.archive && window.MEDIA.archive[seed];
    if (!src) { playSynth(seed); return; }              // default demo: synth

    const ytId = parseYouTube(src);                     // YouTube link → audio only (no redirect)
    if (ytId) { startYT(ytId); return; }

    htmlAudio = new Audio(src);
    htmlAudio.volume = 0.9;
    htmlAudio.addEventListener('ended', () => { if (current === li) stopAll(); });
    htmlAudio.addEventListener('error', () => { htmlAudio = null; if (current === li) playSynth(seed); }, { once: true });
    const p = htmlAudio.play();
    if (p && p.catch) p.catch(() => { htmlAudio = null; if (current === li) playSynth(seed); });
  }

  // the transparent title hotspot triggers playback
  slider.addEventListener('click', (e) => {
    const btn = e.target.closest('.play-hit');
    if (!btn) return;
    if (current && current === btn.closest('li')) { stopAll(); return; } // toggle off
    playTrack(btn);
  });
  npStop.addEventListener('click', stopAll);

  // horizontal navigation — index-based so scroll-snap lands exactly on a poster
  const posters = Array.from(slider.querySelectorAll('.poster'));
  function currentIndex() {
    const mid = slider.scrollLeft + slider.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    posters.forEach((p, i) => {
      const c = p.offsetLeft + p.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }
  function goTo(i) {
    i = Math.max(0, Math.min(posters.length - 1, i));
    const p = posters[i];
    slider.scrollTo({ left: p.offsetLeft + p.offsetWidth / 2 - slider.clientWidth / 2, behavior: 'smooth' });
    updateArrows();
  }
  function step(dir) { goTo(currentIndex() + dir); }

  const prevBtn = document.querySelector('.nav-arrow.prev');
  const nextBtn = document.querySelector('.nav-arrow.next');
  function updateArrows() {
    const i = currentIndex();
    prevBtn.style.opacity = i <= 0 ? '0.35' : '1';
    nextBtn.style.opacity = i >= posters.length - 1 ? '0.35' : '1';
  }
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  slider.addEventListener('scroll', () => { clearTimeout(slider._t); slider._t = setTimeout(updateArrows, 120); }, { passive: true });
  updateArrows();

  slider.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { slider.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });
})();
