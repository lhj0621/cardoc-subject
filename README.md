# Deer-subject

원티드x위코드 백엔드 프리온보딩 7번째 과제입니다.

## 제출 기업 정보

- 기업명 : 카닥
- 주요 서비스 사이트: [카닥](https://www.cardoc.co.kr/)

## 과제 : 타이어 API를 설계 및 구현

### [과제 안내]
🎈 **배경 및 공통 요구사항**
- 데이터베이스 환경은 별도로 제공하지 않습니다.
 **RDB중 원하는 방식을 선택**하면 되며, sqlite3 같은 별도의 설치없이 이용 가능한 in-memory DB도 좋으며, 가능하다면 Docker로 준비하셔도 됩니다.
- 단, 결과 제출 시 README.md 파일에 실행 방법을 완벽히 서술하여 DB를 포함하여 전체적인 서버를 구동하는데 문제없도록 해야합니다.
- 데이터베이스 관련처리는 raw query가 아닌 **ORM을 이용하여 구현**합니다.
- Response Codes API를 성공적으로 호출할 경우 200번 코드를 반환하고, 그 외의 경우에는 아래의 코드로 반환합니다.
![image](https://user-images.githubusercontent.com/42320464/143786456-cc73718b-940d-4969-a48b-983717628ee4.png)


🎁 **요구사항**
- 사용자 생성 API
-  사용자가 소유한 타이어 정보를 저장하는 API
- 사용자가 소유한 타이어 정보 조회 API

## 개발 환경

- 언어: TypeScript
- 프레임워크: NestJs
- 데이터베이스: SQLite3
- 라이브러리 : axios, passport, jwt, bcrypt, typeOrm, class-validator
- 배포 환경 : heroku

---

## ERD

![image](https://user-images.githubusercontent.com/42320464/143786293-3c3879e2-d5dd-46d7-b00c-c4c59e46ef20.png)

## 구현 기능
### 회원가입
- 아이디와 비밀번호를 입력받아 회원가입할 수 있습니다.
- bcrypt의 단방향 암호화로 입력받은 비밀번호를 암호화하여 저장했습니다.

### 로그인
- 아이디와 비밀번호를 입력받아 로그인을 진행합니다.
- 일치하는 경우 accessToken을 발행합니다.
- 일치하지 않는 경우 401 Unauthorized error를 반환합니다.

### 사용자가 소유한 타이어 정보를 저장
- 사용자의 아이디와 차종 id를 입력받습니다.
- 입력받은 데이터를 class-validator을 통하여 체크합니다.
- 과제에서 제공받은 API와 차종 id를 통하여 타이어 정보를 받습니다.
- 최대 5개의 데이터를 동시에 저장할 수 있으며, 트랜잭션을 이용하여 처리하였습니다.
- 외부 API의 데이터를 확인하여 올바른 데이터 형식이 아닌 경우 에러 처리를 하였습니다.
-

### 사용자 소유 타이어 리스트 조회
- 사용자의 아이디를 쿼리 스트링으로 입력받습니다.
- limit와 page를 입력받아 페이징 처리를 하였습니다. 미 입력 시 디폴트 값으로 처리됩니다.

---

## API 문서

<!-- TODO -->

API 테스트를 위한 방법을 [POSTMAN document](https://documenter.getpostman.com/view/15323948/UVJckGYC)에서 확인하실 수 있습니다.

## 배포

<!-- TODO -->

Heroku를 이용해 배포를 진행했으며, 사이트의 주소는 [https://cardoc-subject.herokuapp.com/](https://cardoc-subject.herokuapp.com/) 입니다.

## 설치 및 실행 방법

### 공통

**로컬에서는 준비한 데이터를 활용할 수 없기 때문에 로컬 환경에서 실행은 권장하지 않습니다.**

1. 최상위 폴더에 `.env` 파일에 `JWT_SECRET`에 임의의 문자열을 작성해 저장합니다.
1. `npm install`으로 패키지를 설치합니다.
1. 테스트
   - 개발일 경우: `npm run start`으로 `localhost:3000`에서 테스트하실 수 있습니다.
   - 배포일 경우: `npm run build`으로 애플리케이션을 빌드합니다. 그리고 `npm run start:prod`으로 실행합니다.
1. POST `localhost:3000/user/signup`에서 `user_id`, `password`를 입력해 유저를 생성합니다.
1. POST `localhost:3000/user/login`에 `user_id`, `password`을 입력하신 후 결과값으로 accessToken을 발급받습니다.
1. 권한이 필요한 API의 주소를 입력한 후, Headers 의 Authorization에 accessToken을 붙여넣어 권한을 얻은 후 API를 호출합니다.


## 폴더 구조
```
+---.github
|       PULL_REQUEST_TEMPLATE.md
|
+---src
|   |   app.controller.spec.ts
|   |   app.controller.ts
|   |   app.module.ts
|   |   app.service.ts
|   |   main.ts
|   |
|   +---auth
|   |   |   auth.module.ts
|   |   |   auth.service.ts
|   |   |   get-user.decorator.ts
|   |   |
|   |   +---auth-guard
|   |   |       jwt-auth.guard.ts
|   |   |
|   |   \---strategies
|   |           jwt.strategy.ts
|   |
|   +---cars
|   |   |   cars.module.ts
|   |   |   cars.service.ts
|   |   |
|   |   +---dto
|   |   |       create-car.dto.ts
|   |   |
|   |   \---entities
|   |           car.entity.ts
|   |
|   +---tires
|   |   |   tires.controller.ts
|   |   |   tires.module.ts
|   |   |   tires.service.ts
|   |   |
|   |   +---dto
|   |   |       create-tire.dto.ts
|   |   |
|   |   \---entities
|   |           tire.entity.ts
|   |
|   \---user
|       |   user.controller.ts
|       |   user.module.ts
|       |   user.service.ts
|       |
|       +---dto
|       |       create-user.dto.ts
|       |       login.dto.ts
|       |
|       \---entities
|               user.entity.ts
|   .eslintrc.js
|   .gitignore
|   .prettierrc
|   nest-cli.json
|   package-lock.json
|   package.json
|   Procfile
|   README.md
|   tsconfig.build.json
|   tsconfig.json
|
```
