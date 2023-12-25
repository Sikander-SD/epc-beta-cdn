@echo off
setlocal enabledelayedexpansion

//------------------------rename file
for %%F in (*.png) do (
   set "filename=%%~nxF"
   
   set "newfile=!filename:_prev_ui=!" //remove string from filename
   if not "!filename!"=="!newfile!" ( ren "%%F" "!newfile!" )
echo renamed file "%%~nxF" to !newfile!

   //-------------------------create folder from filename and move file to that folder
   set "filename=!newfile:.png=!"
   set "folder=!filename: =_!"
echo created folder: !folder!
   if not exist "!folder!" ( mkdir "!folder!" )

   //--------------------------move file to folder
   move "!newfile!" "!folder!"

   //------------------------rename file in each folder to main.png
   ren "!folder!\!newfile!" main.png
)

//------------------------rename folders: optional
for /d %%F in (*) do (
   set "folder=%%~nxF"
   set "newfolder=!folder: =_!"
echo renamed folder "%%~nxF" to !newfolder!
   if not "!folder!"=="!newfolder!" ( ren "%%F" "!newfolder!" )
)

//------------------------delete all jpg files
set /p choice=Are you sure you want to delete all .jpg files? (Y/N): 
if /i "%choice%"=="Y" (
    for /r %%f in (*.jpg) do del "%%f"
echo All .jpg files have been deleted.
) else ( echo Deletion canceled. )

endlocal
pause
