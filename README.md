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

## 미디어 에셋 (연결 완료)

영상·오디오·로고 파일이 `assets/media/`에 포함되어 바로 재생됩니다.
> ⚠️ 저작권 문제로 실제 음원/뮤직비디오 대신 **동일 경로의 플레이스홀더 미디어**(절차적 생성)를 넣어 두었습니다.
> 실제 파일로 같은 이름으로 교체만 하면 그대로 동작합니다.

```
assets/media/
  troubleshooting.mp4  hairdye.mp4  breakthrough.mp4  deadand.mp4   # DISCOGRAPHY 전체화면 배경 영상(오디오 포함)
  logos/hello.svg overload.svg deadlock.svg deadand.svg            # DISCOGRAPHY 중앙 앨범 로고
  audio/1.mp3 … 17.mp3                                              # ARCHIVE 트랙별 오디오 (data-seed 기준)
  behind/main.mp4 practice.mp4 mv.mp4 jacket.mp4 tour.mp4           # BEHIND 비하인드 영상
```

- `discography.html`의 각 `.album[data-start]` 값은 후렴 시작 지점(초)이며, 영상이 로드되면 해당 지점부터 재생됩니다.
- 우측 하단 **소리 켜기** 버튼으로 영상의 오디오를 함께 들을 수 있습니다(브라우저 자동재생 정책상 최초 1회 클릭 필요).
- ARCHIVE는 포스터의 곡명을 클릭하면 해당 트랙 오디오가 재생됩니다.

## 구조

```
index.html
discography.html / archive.html / behind.html
assets/
  css/common.css
  js/discography.js  archive.js  behind.js
```
