/* ARCHIVE — street-poster tracklist with click-to-play audio.
 *
 * Each track tries to play a real audio file (assets/media/audio/<seed>.mp3).
 * When the file is missing (placeholder build), it falls back to a short
 * synthesized Web Audio motif so the interaction is fully demonstrable.
 */
(function () {
  const slider = document.getElementById('slider');
  const np = document.getElementById('nowPlaying');
  const npTitle = document.getElementById('npTitle');
  const npAlbum = document.getElementById('npAlbum');
  const npStop = document.getElementById('npStop');

  let audioCtx = null;
  let synthNodes = [];
  let htmlAudio = null;
  let current = null; // the <li> currently playing

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function stopAll() {
    // stop synth
    synthNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
    synthNodes = [];
    // stop file audio
    if (htmlAudio) { htmlAudio.pause(); htmlAudio = null; }
    if (current) current.classList.remove('playing');
    current = null;
    np.classList.remove('show');
  }

  // Synthesized fallback: a little riff seeded per track so each sounds distinct.
  function playSynth(seed) {
    const ctx = getCtx();
    const base = 196 + (seed % 8) * 28;           // vary root note
    const scale = [0, 3, 5, 7, 10, 12];           // minor pentatonic-ish
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.05);

    for (let i = 0; i < 6; i++) {
      const t = now + i * 0.18;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const semitone = scale[(seed + i) % scale.length];
      osc.type = i % 2 ? 'triangle' : 'sawtooth';
      osc.frequency.value = base * Math.pow(2, semitone / 12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.24);
      synthNodes.push(osc);
    }
  }

  function playTrack(li) {
    stopAll();
    current = li;
    li.classList.add('playing');

    const title = li.querySelector('.title').textContent.trim();
    const album = li.closest('.poster').querySelector('h2').textContent.trim();
    npTitle.textContent = title;
    npAlbum.textContent = album.toUpperCase();
    np.classList.add('show');

    const seed = parseInt(li.dataset.seed || '0', 10);
    const src = 'assets/media/audio/' + seed + '.mp3';

    // try the real file first; on error, fall back to synth
    htmlAudio = new Audio(src);
    htmlAudio.volume = 0.9;
    htmlAudio.addEventListener('ended', () => { if (current === li) stopAll(); });
    htmlAudio.addEventListener('error', () => {
      htmlAudio = null;
      if (current === li) playSynth(seed);
    }, { once: true });
    const p = htmlAudio.play();
    if (p && p.catch) p.catch(() => { htmlAudio = null; if (current === li) playSynth(seed); });
  }

  // delegate clicks on tracklist items
  slider.addEventListener('click', (e) => {
    const li = e.target.closest('.tracklist li');
    if (!li) return;
    if (li === current) { stopAll(); return; }   // toggle off
    playTrack(li);
  });

  npStop.addEventListener('click', stopAll);

  // horizontal navigation
  const posters = Array.from(slider.querySelectorAll('.poster'));
  function step(dir) {
    const w = posters[0].getBoundingClientRect().width + 46;
    slider.scrollBy({ left: dir * w, behavior: 'smooth' });
  }
  document.querySelector('.nav-arrow.prev').addEventListener('click', () => step(-1));
  document.querySelector('.nav-arrow.next').addEventListener('click', () => step(1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // let the page scroll wheel drive horizontal movement over the slider
  slider.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      slider.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
})();
