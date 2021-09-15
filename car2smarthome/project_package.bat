@echo off
color 0a
mode con cols=60 lines=20
setlocal

:: 첫번재인자 => 사용할 디바이스명
:: 두번째인자 => 명령실행 후 자동종료 여부
if "%1" == "" (
	set device=emulator
) else (
	set device=%1
)

if "%2" == "" (
	set auto_close=/k
) else (
	set auto_close=/c
)
echo 사용기기: %device%
echo 자동종료: %auto_close%
cd,


:START_POINT
echo ┌─────[ 프로젝트 패키지 자주쓰는 명령어 ]───
echo │
echo │  1. npm pack 진행
echo │  2. ares-package 진행
echo │  3. ares-install 진행 (%device%)
echo │  4. ares-inspect service 진행 (%device%)
echo │  5. ares-inspect app 진행 (%device%)
echo │
echo │  6. 실행중인 app 종료 (%device%)
echo │  7. 설치된 앱 삭제 (%device%)
echo │
echo ├───────────────────────────────────────────

:INPUT0
set /p doing_num=│ 수행할 명령 번호를 입력 :

echo └──────────────────────────────────────────


if "%doing_num%" == "" (
	goto INPUT0
)
if not "%doing_num%" gtr "0" (
	goto INPUT0
)
if not "%doing_num%" leq "9" (
	goto INPUT0
)

if %doing_num% == 1 (
	start cmd %auto_close% npm run pack -p
)
if %doing_num% == 2 (
	start cmd %auto_close% ares-package dist service -o ipk
)
if %doing_num% == 3 (
	start cmd %auto_close% ares-install --device %device% ./ipk/com.ta.car2smarthome_1.0.0_all.ipk
)
if %doing_num% == 4 (
	start cmd %auto_close% ares-inspect -d %device% --service com.ta.car2smarthome.service
)
if %doing_num% == 5 (
	start cmd %auto_close% ares-inspect -d %device% --app com.ta.car2smarthome --open
)

if %doing_num% == 6 (
	start cmd %auto_close% ares-launch -c com.ta.car2smarthome
)
if %doing_num% == 7 (
	start cmd %auto_close% ares-install --device %device% --remove com.ta.car2smarthome
)


cls
goto START_POINT
pause
