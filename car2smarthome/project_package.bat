@echo off
color 0a
mode con cols=60 lines=20
setlocal

:: ù�������� => ����� ����̽���
:: �ι�°���� => ���ɽ��� �� �ڵ����� ����
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
echo �����: %device%
echo �ڵ�����: %auto_close%
cd,


:START_POINT
echo ������������[ ������Ʈ ��Ű�� ���־��� ���ɾ� ]������
echo ��
echo ��  1. npm pack ����
echo ��  2. ares-package ����
echo ��  3. ares-install ���� (%device%)
echo ��  4. ares-inspect service ���� (%device%)
echo ��  5. ares-inspect app ���� (%device%)
echo ��
echo ��  6. �������� app ���� (%device%)
echo ��  7. ��ġ�� �� ���� (%device%)
echo ��
echo ����������������������������������������������������������������������������������������

:INPUT0
set /p doing_num=�� ������ ���� ��ȣ�� �Է� :

echo ��������������������������������������������������������������������������������������


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
	start cmd %auto_close% ares-launch -d %device% -c com.ta.car2smarthome
)
if %doing_num% == 7 (
	start cmd %auto_close% ares-install --device %device% --remove com.ta.car2smarthome
)


cls
goto START_POINT
pause
