/* =====================================================================
 * 중앙 미디어 설정 (Media manifest)
 * 모든 로고 / 영상 / 오디오 경로를 이 한 파일에서 관리합니다.
 * - 값은 로컬 경로("assets/media/...")든 외부 URL이든 됩니다.
 * - archive: 트랙 seed → 오디오. 값이 없는 seed는 데모용 합성음으로 재생됩니다.
 *   실제 음원을 넣으려면 "13": "https://.../song.mp3" 처럼 추가하세요.
 * - behind: 유튜브 영상 ID 목록 (제목은 브라우저에서 자동 표시).
 * ===================================================================== */
window.MEDIA = {
  discography: [
    { key: "hello", label: "Hello, world!", logo: "assets/media/logos/hello.svg", video: "assets/media/disco/hello.mp4", start: 0 },
    { key: "overload", label: "Overload", logo: "assets/media/logos/overload.svg", video: "assets/media/disco/overload.mp4", start: 0 },
    { key: "deadlock", label: "Deadlock", logo: "assets/media/logos/deadlock.svg", video: "assets/media/disco/deadlock.mp4", start: 0 },
    { key: "livelock", label: "Livelock", logo: "assets/media/logos/livelock.svg", video: "assets/media/disco/livelock.mp4", start: 0 },
    { key: "troubleshooting", label: "Troubleshooting", logo: "assets/media/logos/troubleshooting.svg", video: "assets/media/disco/troubleshooting.mp4", start: 0 },
    { key: "liveandfall", label: "LIVE and FALL", logo: "assets/media/logos/liveandfall.svg", video: "assets/media/disco/liveandfall.mp4", start: 0 },
    { key: "beautifulmind", label: "Beautiful Mind", logo: "assets/media/logos/beautifulmind.svg", video: "assets/media/disco/beautifulmind.mp4", start: 0 },
    { key: "lxvetodeath", label: "LXVE to DEATH", logo: "assets/media/logos/lxvetodeath.svg", video: "assets/media/disco/lxvetodeath.mp4", start: 0 },
    { key: "deadand", label: "DEAD AND", logo: "assets/media/logos/deadand.svg", video: "assets/media/disco/deadand.mp4", start: 0 }
  ],

  // ARCHIVE — 트랙(seed) → 오디오. 기본은 비워두어 합성음으로 재생(총 66곡).
  archive: {
    // 예: "13": "https://example.com/helium-balloon.mp3"
  },

  // BEHIND — 유튜브 비하인드 영상
  behind: [
    { id: "4N9Ir4X9RTc", label: "Behind Clip 1" },
    { id: "hQEn5Ko17NU", label: "Behind Clip 2" },
    { id: "5VFodZm1R_s", label: "Behind Clip 3" },
    { id: "Lelb9sCjMis", label: "Behind Clip 4" },
    { id: "dcf2qHxVCvY", label: "Behind Clip 5" }
  ]
};
