# CarDashboard
WebOS Car Dashboard Using Enact 

<br>

# NodeJS 설치
홈페이지 접속 인스톨러 다운로드, 설치 : https://nodejs.org/ko/download/

<br>

### 설치 확인

    1. node -v
    
    2. npm -v

![image](https://user-images.githubusercontent.com/12757811/127740877-4801360a-8c0b-4002-956e-d65a4b55afa1.png)

> nodejs 모듈 설치 : npm install @@@@
>
> nodejs 명령어 검색 : npm -l
>
> <br>

# Enact 개발환경 세팅

출처 : https://enactjs.com/docs/tutorials/setup/

<br>

### Enact CLI 설치

    npm install -g @enact/cli

<br>

### WebOS 템플릿 설치

    enact template install @enact/template-webostv

<br>

### 실행 (해당 디렉토리)

    npm run serve
    
    http://localhost:8080/

<br>

# ipk 패키징

1. 패키지
    `npm run pack-p`
2. 패키지2
    `ares-package dist service -o ipk`
3. 설치
    `ares-install --device emulator ./ipk/com.ta.car2webos_1.0.1_all.ipk`
4. 테스트 (서비스)
    `ares-inspect -d emulator --service com.ta.car2webos.service`
5. 테스트 (웹앱)
    `ares-inspect -d emulator --app com.ta.car2webos --open`



