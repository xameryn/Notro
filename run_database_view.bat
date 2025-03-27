@echo off
echo MongoDB Database Viewer
echo ----------------------
echo.
echo Available commands after connection:
echo - show collections            : List all collections
echo - db.collectionName.find()   : View all documents in a collection
echo - db.collectionName.pretty() : View formatted documents
echo.

:: Change these settings according to your MongoDB installation
set MONGO_PATH="C:\Program Files\MongoDB\Server\6.0\bin"

:: Launch MongoDB shell with direct connection to notro_database
cd %MONGO_PATH%
mongosh.exe "mongodb://127.0.0.1:27017/notro_database"

echo Database connection closed.
pause