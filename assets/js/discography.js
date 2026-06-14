/* DISCOGRAPHY — full-screen background deck.
 * Each album's background can be an mp4 (<video>) OR a YouTube video.
 * Scrolling snaps to the next album and auto-plays its background; the
 * bottom-center motion icon is the mute toggle and shows the sound state.
 */
(function () {
  const deck = document.getElementById('deck');
  const albums = Array.from(deck.querySelectorAll('.album'));
  const dotsWrap = document.getElementById('dots');
  const cue = document.getElementById('scrollCue');
  let soundOn = false;
  let active = null;

  function ytIdFrom(s) {
    if (!s) return null; s = String(s).trim();
    const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
  }

  // ---- YouTube IFrame API (shared) ----
  let ytApiReady = false; const ytApiQueue = [];
  function loadYT(cb) {
    if (window.YT && window.YT.Player) { ytApiReady = true; cb(); return; }
    ytApiQueue.push(cb);
    if (document.getElementById('yt-api')) return;
    const s = document.createElement('script'); s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = function () { ytApiReady = true; ytApiQueue.splice(0).forEach((f) => f()); };
  }
  const ytPlayers = {}; // dot index -> player

  // ---- apply central media manifest ----
  const cfg = (window.MEDIA && window.MEDIA.discography) || [];
  albums.forEach((a, i) => {
    const c = cfg[i]; if (!c) return;
    const lg = a.querySelector('.logo');
    if (c.logo) lg.src = c.logo;
    if (c.start != null) a.dataset.start = String(c.start);
    const yt = ytIdFrom(c.video);
    if (yt) {
      a.dataset.yt = yt;
      const v = a.querySelector('video'); if (v) v.remove();
      const host = document.createElement('div'); host.className = 'yt-bg';
      a.insertBefore(host, a.querySelector('.scrim'));
      // show the video's thumbnail as the background so it's visibly applied
      // even when the video disallows embedding (common for official MVs)
      const fb = a.querySelector('.bg-fallback');
      if (fb) {
        fb.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.35)), url('https://i.ytimg.com/vi/" + yt + "/hqdefault.jpg')";
        fb.style.backgroundSize = 'cover';
        fb.style.backgroundPosition = 'center';
      }
    } else if (c.video) {
      const v = a.querySelector('video'); if (v) v.dataset.src = c.video;
    }
  });

  // progress dots
  albums.forEach((a, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', '앨범 ' + (i + 1));
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => a.scrollIntoView({ behavior: 'smooth' }));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function ensureSrc(v) { if (!v.src && v.dataset.src) v.src = v.dataset.src; }

  function playYT(album) {
    const idx = album.dataset.dot, id = album.dataset.yt;
    const make = () => {
      if (ytPlayers[idx]) {
        ytPlayers[idx][soundOn ? 'unMute' : 'mute']();
        ytPlayers[idx].playVideo();
        return;
      }
      const host = album.querySelector('.yt-bg');
      const mount = document.createElement('div'); host.appendChild(mount);
      ytPlayers[idx] = new YT.Player(mount, {
        videoId: id,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, loop: 1, playlist: id, mute: 1 },
        events: {
          onReady: (e) => { soundOn ? e.target.unMute() : e.target.mute(); e.target.playVideo(); },
          onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(0); e.target.playVideo(); } }
        }
      });
    };
    if (ytApiReady) make(); else loadYT(make);
  }

  function play(album) {
    if (active === album) return;
    if (active) stop(active);
    if (album.dataset.yt) {
      playYT(album);
    } else {
      const video = album.querySelector('video');
      if (video) {
        ensureSrc(video);
        const start = parseFloat(album.dataset.start || '0');
        const begin = () => {
          const d = video.duration;
          if (start && isFinite(d) && start < d - 1 && video.currentTime < start) { try { video.currentTime = start; } catch (e) {} }
          video.muted = !soundOn;
          const p = video.play(); if (p && p.catch) p.catch(() => {});
        };
        if (video.readyState >= 1) begin(); else video.addEventListener('loadedmetadata', begin, { once: true });
      }
    }
    album.classList.add('playing', 'in-view');
    active = album;
    const idx = parseInt(album.dataset.dot, 10);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function stop(album) {
    if (album.dataset.yt) {
      const pl = ytPlayers[album.dataset.dot];
      if (pl && pl.pauseVideo) { try { pl.pauseVideo(); } catch (e) {} }
    } else {
      const v = album.querySelector('video'); if (v) v.pause();
    }
    album.classList.remove('playing');
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) { e.target.classList.add('in-view'); play(e.target); }
    });
  }, { threshold: [0, 0.6, 0.9] });
  albums.forEach((a) => io.observe(a));

  deck.addEventListener('scroll', () => { cue.style.opacity = deck.scrollTop > 60 ? '0' : '1'; }, { passive: true });
  play(albums[0]);

  // ---- sound motion icon = mute toggle + visual state ----
  const sound = document.getElementById('soundCtrl');
  function applySound() {
    sound.classList.toggle('on', soundOn);
    sound.classList.toggle('off', !soundOn);
    if (!active) return;
    if (active.dataset.yt) {
      const pl = ytPlayers[active.dataset.dot];
      if (pl) { soundOn ? pl.unMute() : pl.mute(); if (soundOn) pl.playVideo(); }
    } else {
      const v = active.querySelector('video');
      if (v) { v.muted = !soundOn; if (soundOn) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } }
    }
  }
  sound.addEventListener('click', () => { soundOn = !soundOn; applySound(); });
  sound.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soundOn = !soundOn; applySound(); } });

  document.addEventListener('visibilitychange', () => {
    if (!active) return;
    if (active.dataset.yt) {
      const pl = ytPlayers[active.dataset.dot]; if (!pl) return;
      document.hidden ? pl.pauseVideo() : pl.playVideo();
    } else {
      const v = active.querySelector('video'); if (!v) return;
      if (document.hidden) v.pause(); else { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    }
  });
})();
