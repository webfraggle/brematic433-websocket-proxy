# brematic433-websocket-proxy
A ws proxy for Brennenstuhl Brematic 433 gateway and RCS1000N sockets

## Message building and formating is from here
(https://www.symcon.de/forum/threads/27143-Brennenstuhl-Brematic-433-Single-Gateway-%28GWY433%29-Funksteckdosen-433Mhz)

##Short usage nodes
`npm install`

Change brematic 433 gateway server address

`node server.js`

Connect via websocket and send the following JSON
`{"task":"off","master":"10111","slave":"01000"}`

Task: on or off
Master: Your DIP configuration of the RCS100N socket
Slave: Your DIP configuration of the RCS100N socket