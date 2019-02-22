const readline = require('readline');
const net = require('net');
const ip = require('ip');
const Netmask = require('netmask').Netmask;
const http = require('http');
const keepAliveAgent = new http.Agent({  maxSockets:100});
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var timeout = 5000;

ipAdd = ip.address();
console.log('Your IP address: ' + ipAdd);

let block = new Netmask(ipAdd + '/24');
rl.question('Start Port: ', (port) => {
    rl.question('Port Array: ', (portArray) => {
        // http.Agent.Socket.

        var Ports = Array.from(Array(parseInt(portArray)), (x,i) => i+parseInt(port));
        // console.log(Ports);
        console.time("start");

        block.forEach( (ip, long, index) => {
            for (portx in Ports) {
                (function(portx) {
                    //var s = new net.Socket();
                    var s = keepAliveAgent.createConnection({host: ip,port: Ports[portx], family:4},() =>{
                        console.log('REPLY: ' + ip + ':' + Ports[portx])
                        console.log()
                        
                    });
                    s.on('data', function(e){
                        console.log('DATA: ' + ip + ':' + Ports[portx] + ", response: " + e.toString())


                    })
                    s.setTimeout(timeout, function() { 
                       //  console.log('NO REPLY: ' + ip + ':' + Ports[portx])

                        s.end(); });

                    s.on('error', function(e) {
                        s.end();
                    });
                    

                })(portx);
            };
        });
        console.timeEnd("start");
        rl.close();
    })
});
