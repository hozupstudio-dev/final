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
| `index.html` | 랜딩 | 3개 페이지로 진입하는 허브 + 에셋 관리 진입 |
| `discography.html` | DISCOGRAPHY | 전체화면 배경 영상 9개(역대 앨범)를 스크롤로 전환. 중앙에 로고·발매연도·앨범 차수·앨범명. 하단 중앙 **모션 아이콘 = 음소거 토글 + 상태 표시** |
| `archive.html` | ARCHIVE | 거리 포스터 형식 가로 슬라이드 트랙 리스트(9장 전곡). **곡 제목(투명 핫스팟) 클릭 시 재생** (← → / 휠 전환, Now Playing 바) |
| `behind.html` | Behind The Scene | **문을 두드려(knock knock) 입장**하는 도어 인터랙션 → 내부에서 **유튜브 비하인드 영상**(임베드) 갤러리, 클릭 시 라이트박스 재생 |
| `assets.html` | — | 로고·영상·유튜브 ID·트랙 오디오를 한 곳에서 교체하고 `media.js`를 생성하는 관리 페이지 |

## 중앙 미디어 설정 — `assets/js/media.js`

모든 로고/영상/오디오/유튜브 경로를 이 한 파일에서 관리합니다. `assets.html`에서 편집 후 생성한 코드를 덮어쓰면 전 페이지에 적용됩니다.

```
assets/media/
  disco/<key>.mp4         # DISCOGRAPHY 9개 앨범 배경 영상(오디오 포함, 절차적 플레이스홀더)
  logos/<key>.svg         # DISCOGRAPHY 중앙 엠블럼 로고(스왑용 플레이스홀더)
```

- **DISCOGRAPHY/로고/배경 영상**: 실제 파일을 같은 이름으로 `assets/media/`에 넣거나, `media.js`/관리 페이지에서 경로·URL로 교체.
- **ARCHIVE 오디오**: 기본은 트랙별 **데모 합성음**(파일 불필요). 실제 음원은 `media.js`의 `archive`에 `"<seed>": "URL"`로 추가.
- **BEHIND 영상**: `media.js`의 `behind`에 **유튜브 영상 ID** 목록. 임베드로 재생되며 제목은 브라우저에서 자동 표시.

> 디스코그래피/트랙리스트 데이터는 공개 자료(위키피디아 등)를 참고했습니다. 앨범 커버/트랙리스트 이미지 등은 저작권 및 작업 환경의 외부 다운로드 제한으로 포함하지 않았으며, 위 관리 페이지로 직접 추가할 수 있습니다.

## 구조

```
index.html  discography.html  archive.html  behind.html  assets.html
assets/
  css/common.css
  js/media.js  discography.js  archive.js  behind.js
  media/disco/*.mp4  media/logos/*.svg
```
