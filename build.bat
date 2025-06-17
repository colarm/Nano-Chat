
:: This .bat file could build the frontend, copy the export folder to backend, and run backend automaticly. 

cd frontend
call npm run build
cd ../backend
rmdir /s /q dist
mkdir dist
xcopy "..\frontend\dist" "./dist" /s /e
node server.js