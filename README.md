# XDINARY HEROES — Interactive Fansite

기획안 3개 슬라이드(DISCOGRAPHY · ARCHIVE · Behind The Scene)를 각각 HTML 페이지로 구현한 결과물입니다.
별도 빌드 없이 정적 파일로 동작합니다. (`index.html`을 브라우저로 열거나 간단한 로컬 서버로 실행)

```bash
# 예: 로컬 서버
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 페이지 구성

| 파일 | 슬라이드 | 핵심 인터랙션 |
|------|----------|----------------|
| `index.html` | 랜딩 | 3개 페이지로 진입하는 허브 |
| `discography.html` | DISCOGRAPHY | 스크롤 시 화면에 들어온 앨범의 **타이틀 후렴구 비디오·오디오가 자동 재생** (IntersectionObserver, 우측 하단 소리 토글) |
| `archive.html` | ARCHIVE | 시멘트 벽 위 **거리 포스터 형식의 가로 슬라이드** 트랙 리스트. **곡명 클릭 시 오디오 재생** (← → / 휠 전환, Now Playing 바) |
| `behind.html` | Behind The Scene | **건물 내부로 진입하는 도어 인터랙션**(문 열림 → 카메라 돌리 → 내부 진입) 후 비하인드 영상 갤러리 / 라이트박스 재생 |

## 미디어 에셋 (선택)

실제 영상·오디오 파일을 아래 경로에 넣으면 자동으로 사용됩니다.
**파일이 없으면** 각 페이지가 우아하게 대체 동작합니다
(DISCOGRAPHY·BEHIND는 포스터/플레이 버튼 표시, ARCHIVE는 합성 사운드로 재생을 시연).

```
assets/media/
  troubleshooting.mp4  hairdye.mp4  breakthrough.mp4  deadand.mp4   # DISCOGRAPHY 타이틀 후렴 클립
  audio/1.mp3 … 17.mp3                                              # ARCHIVE 트랙별 오디오 (data-seed 기준)
  behind/main.mp4 practice.mp4 mv.mp4 jacket.mp4 tour.mp4           # BEHIND 비하인드 영상
```

`discography.html`의 각 `.album[data-start]` 값은 후렴 시작 지점(초)이며, 영상이 로드되면 해당 지점부터 재생됩니다.

## 구조

```
index.html
discography.html / archive.html / behind.html
assets/
  css/common.css
  js/discography.js  archive.js  behind.js
```
