to start websocket server:  node ws.js
to start websocket server with custom port, e.g 9876:    PORT=9876 node ws.js
to start websocket server with file `file.log` in the same directory:    USE_FILE=1 node ws.js (Make sure you have file file.log, if you don't, touch file.log and provide some fake data for it')
to start websocket server with custom file, e.g /home/ubuntu/somefile.txt:    FILE=/home/ubuntu/somefile.txt node ws.js
Msg stops sending during 19h -> 8h, to continously send, set NONSTOP=1
