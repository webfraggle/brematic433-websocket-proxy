// Webscocket Part
const WebSocket = require('ws');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const $server_ip   = '192.168.178.22'; // IP of the brematic 433 Gateway 
const $server_port = 49880; //Port des Gateway 

// Example JSON:
// {"task":"off","master":"10111","slave":"01000"}
    

const wss = new WebSocket.Server({ port: 8088 });


  wss.on('connection', function connection(ws) {
    
    // send volume update
    
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);

      try {
          
          var msgObject = JSON.parse(message);
      } catch (error) {
          console.log('Parse error');
          ws.send('JSON Parse Error');
          return;
      }
      if (msgObject && msgObject.task)
      {
          switch (msgObject.task)
          {
              case 'on':
              case 'off':
                console.log(msgObject.task);
                // $master="10111";
                // $slave="01000";
                var msg = createMessage(msgObject.master,msgObject.slave,msgObject.task == 'on' ? true : false);
                ws.send(msg);
                message = Buffer.from(msg);
                console.log($server_ip,$server_port,message);
                client.send(message, $server_port, $server_ip, (err) => {
                    console.log('udp error:',err);
                    //client.close();
                  });
              break;
              
          }
      }

    }
    
);
ws.on('error', () => console.log('errored'));
  
    // ws.send('something');
  });
wss.on('error', function error(err) {
    console.log('wss Error', err);
});


var createMessage = function($master,$slave,onoff)
{
    

    $sA=0; 
    $sG=0; 
    $sRepeat=10; 
    $sPause=5600; 
    $sTune=350; 
    $sBaud=25; 
    $sSpeed=16; 
    $uSleep=800000; 
    $txversionan=1;  //komischerweise schaltet nur in txversion 1 an 
    $txversionaus=3; //komischerweise schaltet nur in txversion 3 aus 
    $HEAD="TXP:"+$sA+","+$sG+","+$sRepeat+","+$sPause+","+$sTune+","+$sBaud+","; 
    $TAILAN=","+$txversionan+",1,"+$sSpeed+",;"; 
    $TAILAUS=","+$txversionaus+",1,"+$sSpeed+",;"; 
    $AN="1,3,1,3,3"; 
    $AUS="3,1,1,3,1"; 
    $bitLow=1; 
    $bitHgh=3; 
    $seqLow=$bitHgh+","+$bitHgh+","+$bitLow+","+$bitLow+","; 
    $seqHgh=$bitHgh+","+$bitLow+","+$bitHgh+","+$bitLow+","; 
    $bits=$master; 
    $msg=""; 
    for($i=0;$i<$bits.length;$i++) { 
        $bit=$bits.substr($i,1); 
        if($bit=="0") { 
            $msg=$msg+$seqLow; 
        } else { 
            $msg=$msg+$seqHgh; 
        } 
    } 
    $msgM=$msg; 
    $bits=$slave; 
    $msg=""; 
    for($i=0;$i<$bits.length;$i++) { 
        $bit=$bits.substr($i,1); 
        if($bit=="0") { 
            $msg=$msg+$seqLow; 
        } else { 
            $msg=$msg+$seqHgh; 
        } 
    } 
    $msgS=$msg;

    // $out = $HEAD+$bitLow+","+$msgM+$msgS+$bitHgh+","+$AUS+$TAILAUS;
    if (onoff) {
        $out = $HEAD+$bitLow+","+$msgM+$msgS+$bitHgh+","+$AN+$TAILAN; 
    } else {
        $out = $HEAD+$bitLow+","+$msgM+$msgS+$bitHgh+","+$AUS+$TAILAUS; 

    }

    console.log($out); 
    return $out;
    // $message     = 'TXP:0,0,10,10920,91,42,57,18,8,4,8,4,8,4,4,8,4,8,4,8,8,4,8,4,4,8,8,4,4,8,4,8,4,8,4,8,8,4,8,4,4,8,4,8,4,8,4,8,4,8,4,8,4,8,8,4,4,8,4,8,8,4,8,4,4,8,8,4,4,8,8,4,4,8,4,8,8,4,8,4,4,8,4,8,8,4,8,120,0;'; //Raw Cod
}


