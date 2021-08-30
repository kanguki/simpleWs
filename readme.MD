to start websocket server:  node ws.js

to start websocket server with **custom port**, e.g 9876:    PORT=9876 node ws.js

to start websocket server with **file** `file.log` in the same directory:    USE_FILE=1 node ws.js (Change data in file.log as you wish)

to start websocket server with **custom file**, e.g /home/ubuntu/somefile.txt:    FILE=/home/ubuntu/somefile.txt node ws.js

Msg stops sending during 19h -> 8h timezone +7, to **continously send**, set NONSTOP=1 or **reset timezone** to your timezone by setting TZ=customTimeZone
