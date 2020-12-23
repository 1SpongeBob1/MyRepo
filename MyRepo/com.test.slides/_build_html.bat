echo "删除无用资源和原模板"
::删除资源
del /f /s /q .\build\web-mobile\favicon.ico
del /f /s /q .\build\web-mobile\splash.png
::删除启动模板
del /f /s /q .\build\web-mobile\index.html
del /f /s /q .\build\web-mobile\main.js
del /f /s /q .\build\web-mobile\style-desktop.css
del /f /s /q .\build\web-mobile\style-mobile.css

echo "替换试玩广告模块"
::替换启动模板
copy /y ..\..\_doc\_试玩广告模板_ccc_233\index.html .\build\web-mobile\
copy /y ..\..\_doc\_试玩广告模板_ccc_233\main.js .\build\web-mobile\
copy /y ..\..\_doc\_试玩广告模板_ccc_233\style-desktop.css .\build\web-mobile\
copy /y ..\..\_doc\_试玩广告模板_ccc_233\style-mobile.css .\build\web-mobile\

::合并html
pushd %1 & for %%i in (.) do set curr=%%~ni
echo %curr%
echo cleaning
rd/s/q ..\..\_cocos-to-playable-ad-master\src\web-mobile
rd/s/q ..\..\_cocos-to-playable-ad-master\dist

echo initing
md ..\..\_cocos-to-playable-ad-master\dist
md ..\..\_cocos-to-playable-ad-master\src\web-mobile

xcopy .\build\web-mobile ..\..\_cocos-to-playable-ad-master\src\web-mobile /s /e
call npm run build --prefix ..\..\_cocos-to-playable-ad-master
ren ..\..\_cocos-to-playable-ad-master\dist\index.html %curr%_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.html
start explorer "..\..\_cocos-to-playable-ad-master\dist"
pause