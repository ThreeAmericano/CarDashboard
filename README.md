# CarDashboard
WebOS Car Dashboard Using Enact 

# 화면
1. 로그인 페이지
![1  로그인 페이지](https://user-images.githubusercontent.com/12757811/138590098-7c1a8cf1-c772-4f98-b080-cc65de02d8f8.png)
<br>
2. 회원가입 페이지
![2  회원가입 페이지](https://user-images.githubusercontent.com/12757811/138590129-69918138-f35a-415c-9299-61ca70291178.png)
<br>
3. 홈 페이지
![3  홈 페이지](https://user-images.githubusercontent.com/12757811/138590131-6c2622b1-7f5a-49f4-b68e-fc15c5572575.png)
<br>
4. 모드 설정 페이지
![4  모드 설정 페이지](https://user-images.githubusercontent.com/12757811/138590132-780292ab-7e0c-4268-a1de-da1beee5340f.png)
<br>
5. 스케줄 설정 페이지
![5  스케줄 설정 페이지](https://user-images.githubusercontent.com/12757811/138590134-ce95f458-8685-4eb8-b7a1-de2ffb6e32a1.png)
<br>
6. 가전 상세 제어 페이지
![6  가전 상세 제어 페이지](https://user-images.githubusercontent.com/12757811/138590135-d6c38ce2-202a-47f6-b2b4-9dd24f3fddd9.png)
<br>
7. 가전 동작 정보 및 설정 페이지
![7  가전 동작 정보 및 설정 페이지](https://user-images.githubusercontent.com/12757811/138590137-deb76c9e-cffb-46fc-bc87-a4029ea4f773.png)

<br><br><br><br><br>

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



