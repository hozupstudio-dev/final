/* =====================================================================
 * 중앙 미디어 설정 (Media manifest)
 * ---------------------------------------------------------------------
 * 모든 로고 / 영상 / 오디오 경로를 이 한 파일에서 관리합니다.
 * - 값은 로컬 경로("assets/media/...")든 외부 URL("https://...")이든 됩니다.
 * - 실제 파일을 같은 이름으로 assets/media/ 에 넣어도 되고,
 *   이 경로만 바꿔도 됩니다.
 * - assets.html 관리 페이지에서 입력하면 이 파일을 자동 생성해 줍니다.
 * ===================================================================== */
window.MEDIA = {

  // DISCOGRAPHY — 앨범별 중앙 로고 + 전체화면 배경 영상 + 후렴 시작초(start)
  discography: [
    { key: "hello",    label: "Hello, world! (1st Mini)", logo: "assets/media/logos/hello.svg",    video: "assets/media/troubleshooting.mp4", start: 0 },
    { key: "overload", label: "Overload (2nd Mini)",      logo: "assets/media/logos/overload.svg", video: "assets/media/hairdye.mp4",         start: 0 },
    { key: "deadlock", label: "Deadlock (3rd Mini)",      logo: "assets/media/logos/deadlock.svg", video: "assets/media/breakthrough.mp4",    start: 0 },
    { key: "deadand",  label: "DEAD AND (8th Mini)",      logo: "assets/media/logos/deadand.svg",  video: "assets/media/deadand.mp4",         start: 0 }
  ],

  // ARCHIVE — 트랙(seed) → 오디오. archive.html 의 data-seed 값과 1:1 매칭
  archive: {
    "1":  "assets/media/audio/1.mp3",   // Knock Down
    "2":  "assets/media/audio/2.mp3",   // X-MAS
    "3":  "assets/media/audio/3.mp3",   // Crack
    "4":  "assets/media/audio/4.mp3",   // Don't Be Sad
    "5":  "assets/media/audio/5.mp3",   // Hair Cut
    "6":  "assets/media/audio/6.mp3",   // Pin
    "7":  "assets/media/audio/7.mp3",   // Strawberry Cake
    "8":  "assets/media/audio/8.mp3",   // おかえり
    "9":  "assets/media/audio/9.mp3",   // Break the Brake
    "10": "assets/media/audio/10.mp3",  // Freedom
    "11": "assets/media/audio/11.mp3",  // Sucker Punch
    "12": "assets/media/audio/12.mp3",  // Devil
    "13": "assets/media/audio/13.mp3",  // Helium Balloon
    "14": "assets/media/audio/14.mp3",  // Voyager
    "15": "assets/media/audio/15.mp3",  // Rise High Rise
    "16": "assets/media/audio/16.mp3",  // Must Be Good
    "17": "assets/media/audio/17.mp3"   // X-room
  },

  // BEHIND — 비하인드 영상
  behind: {
    main:     "assets/media/behind/main.mp4",     // 메인 피처 클립
    practice: "assets/media/behind/practice.mp4", // 합주 비하인드
    mv:       "assets/media/behind/mv.mp4",        // MV 메이킹
    jacket:   "assets/media/behind/jacket.mp4",    // 재킷 촬영
    tour:     "assets/media/behind/tour.mp4"       // 투어 다이어리
  }
};
