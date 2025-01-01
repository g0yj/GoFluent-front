# Language Cube Front Admin

## Version

- node: v20.11.1

## 프로젝트 실행 (dev)

```
yarn run dev
```

## 프로젝트 빌드 (prod)

```
yarn run build
```

## 기본 설치 패키지

- react-router-dom
- sass
- redux
- classnames
- axios

## 기본 설정

- 라우팅 설정
- `src/routes.jsx` 참조
- index.css: reset css
- .prettierrc.json
- printWidth: 100
- @ alias

## 폴더 구조(src)

- app : 데이터 처리(통신, 저장)
  - helper : 기타 유틸성 기능들
  - local : localStorage, sessionStorage 등 브라우저 관련 데이터 처리
  - remote : api 호출
  - service : 페이지에서 호출할 인터페이스
- components : 공용 컴포넌트
- hooks : 커스텀 hook
- pages : 페이지
- redux : 상태관리
- styles : css
- utils : js 유틸리티
- main.jsx
- routes.jsx

## 신규 window 추가 방법

1. `/src/app/helper/helper-window.js`에서 `WINDOWS` object에 데이터 추가
   - id: 유니크한 값
   - url: routes.jsx에 설정할 값
   - options: window 크기 옵션
2. 1번에서 추가한 url값으로 `/src/routes.jsx`에 신규 route path 추가
3. `/src/app/helper/windows-hooks` 폴더에 신규 파일 생성
   - 이미 만들어져 있는 다른 파일들 참조
   - 2가지 정의
     - window 간에 공유할 상태 정의
     - window open 함수 정의
4. 3번에서 만든 훅을 호출해서 window 오픈

## 배포
### 환경 설정
#### node 다운로드 및 설치 (v20)
  - 다운로드 - https://nodejs.org/en/download/prebuilt-installer
  - 설치 위치 - C:\dev\node
  - cmd에서 설치 확인 `node --version`
#### yarn 설치
  - cmd에서 실행
  - `npm install -g yarn`
#### nginx 다운로드 및 설치
  - 다운로드 - https://nginx.org/en/download.html
    - stable/window 버전 설치
  - 압축 해제 후, 아래 경로로 이동
    - 설치 위치 - C:\dev\nginx
  - 실행
    - cmd에서 nginx.exe 파일 실행
      - ex) cmd에서 nginx 폴더로 이동 후, `nginx.exe` 입력
    - 또는
    - 파일 탐색기에서 nginx.exe 실행 파일 더블 클릭
  - 실행 확인
    - localhost:80 으로 접속
    - 또는
    - 작업관리자에서 실행 여부 확인
  - 실행 종료
    - 작업관리자에서 종료
    - 또는
    - cmd에서 `nginx.exe -s stop` 입력
  - 재실행
    - cmd에서 `nginx.exe -s reload` 입력
  - react를 위한 설정 변경
    - 설정 파일 - C:\dev\nginx\conf\nginx.conf
    - 위 파일 열어서 수정
    - 아래에 해당하는 위치 찾아서 `try_files $uri /index.html;` 삽입
      ```json
      ...

      http {
        ...

        server {
          ...

          location / {
            ...
            try_files $uri /index.html;
          }
        }
      }
      ```

### 코드 최신화
#### git clone
  - git bash에서 진행
    - 프로젝트 저장할 위치에서 실행
    - 프로젝트들 폴더 위치 - C:\workspace
  - `git clone https://github.com/yangsangho/language-cube-front-admin.git`
#### git pull
  - clone 이후부턴 pull을 이용해 코드 최신화
  - git bash에서 진행
  - `git pull origin main`

### 코드 빌드
#### 패키지 최신화
  - cmd에서 프로젝트 폴더로 이동 후 진행
    - 프로젝트 위치 - C:\workspace\language-cube-front-admin
  - `yarn install`
#### 빌드
  - cmd / 프로젝트 폴더에서 실행
  - `yarn build`
  - 빌드 결과 dist 파일에 생성
#### 빌드 결과물 nginx로 이동
  - C:\workspace\language-cube-front-admin\dist 폴더에 있는 파일들 복사
  - C:\dev\nginx\html 폴더에 있는 파일들 모두 삭제하고 복사한 파일들 붙여넣기

### 재배포 방법 (최초 세팅 이후)
1. git pull로 코드 최신화
2. 패키지 최신화
3. 빌드
4. 빌드 결과물 이동 