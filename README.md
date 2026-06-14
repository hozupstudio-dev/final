# XDINARY HEROES — 인터랙티브 팬사이트 (과제 제출본)

엑스디너리히어로즈(Xdinary Heroes)의 아이덴티티를 다감각적으로 경험할 수 있도록 기획한 인터랙티브 웹페이지입니다.
기획안의 세 가지 콘셉트(DISCOGRAPHY · ARCHIVE · Behind The Scene)를 각각 하나의 페이지로 구현하였습니다.
별도의 빌드 과정 없이 정적 파일로 동작합니다.

## 실행 방법 (로컬 서버 / http)

> ⚠️ 파일을 더블클릭하여 `file://` 로 여시면 **유튜브 영상이 재생되지 않습니다.**
> 아래와 같이 **로컬 서버(http)** 로 실행해 주시기 바랍니다.

```bash
# 1) 프로젝트 폴더로 이동
cd final

# 2) 로컬 서버 실행 (Python 3 기본 내장)
python3 -m http.server 8000

# 3) 브라우저에서 아래 주소로 접속
#   http://localhost:8000/discography.html
#   http://localhost:8000/archive.html
#   http://localhost:8000/behind.html
```

Python이 없으시면 VS Code의 **Live Server** 확장으로 `discography.html` 을 열어 주셔도 동일하게 동작합니다.

## 페이지 소개

교수님께서 확인하기 쉽도록, 각 페이지의 의도와 동작을 간략히 정리하였습니다.

### 1. `discography.html` — DISCOGRAPHY
시청각적 동기화를 통해 음악적 히스토리를 전달하고자 한 페이지입니다.
역대 앨범(미니 8장 + 정규 1장, 총 9장)을 화면 전체 영상으로 구성하였고, 스크롤하면 다음 앨범 영상으로 전환됩니다.
각 화면 중앙에는 앨범 로고와 함께 발매 연도·앨범 차수·앨범명을 표기하였으며, 하단 중앙의 모션 아이콘으로 소리를 켜고 끌 수 있고 그 상태가 시각적으로 표현됩니다.

### 2. `archive.html` — ARCHIVE
스트릿 감성을 살린 거리 포스터 형식으로 전곡 트랙 리스트를 정리한 페이지입니다.
시멘트 벽에 붙인 포스터를 좌우로 넘겨 보며(화살표·방향키·휠), 곡 제목을 누르면 해당 곡이 페이지를 벗어나지 않고 바로 재생됩니다.
음원은 유튜브 링크 또는 오디오 파일을 연결할 수 있으며, 연결 전에는 데모용 사운드로 동작합니다.

### 3. `behind.html` — Behind The Scene
공간 전이를 통해 입체적인 매력을 보여주고자 한 페이지입니다.
문을 두드려(knock knock) 건물 내부로 들어가는 인터랙션 이후, 비하인드 영상들을 갤러리 형태로 배치하여
무대 밖 아티스트의 모습을 친근하게 소개합니다. 영상은 클릭 시 사이트 내에서 바로 재생됩니다.

### (부록) `assets.html` — 에셋 관리
로고·배경 영상·비하인드 유튜브 영상·트랙 음원을 한 곳에서 교체하고, 설정 파일(`assets/js/media.js`)을 생성하는 관리 페이지입니다.

## 미디어 / 데이터에 관한 안내

- 디스코그래피 및 트랙 리스트는 공개 자료(위키피디아 등)를 참고하여 작성하였습니다.
- 저작권을 고려하여 실제 음원·뮤직비디오·앨범 이미지는 포함하지 않았으며, 배경 영상과 로고는 콘셉트 확인용 플레이스홀더로 제작하였습니다.
- 실제 음원(유튜브 링크 등)과 이미지는 `assets.html` 관리 페이지 또는 `assets/js/media.js` 에서 손쉽게 연결할 수 있도록 구성하였습니다.

## 폴더 구조

```
discography.html  archive.html  behind.html  assets.html
assets/
  css/common.css
  js/media.js  tracks.js  discography.js  archive.js  behind.js
  media/disco/*.mp4   media/logos/*.svg
```
