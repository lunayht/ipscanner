const { askQuestions } = require('./temp');
const ip = require('ip');
const net = require('net');
const Netmask = require('netmask').Netmask;
const http = require('http');
const ipAdd = ip.address();
const timeout = 5000;
const keepAliveAgent = new http.Agent();
console.log('Your IP address: ' + ipAdd);
let block = new Netmask(ipAdd + '/24');

askQuestions([
    'Start Port: ',
    'Port Array: ',
]).then(answers => {
    var port = parseInt(answers[0]);
    var portArray = parseInt(answers[1]);
    const n = portArray/200;
    for (var k = 0; k < n; k++) {
        var Ports = Array.from(Array(200), (x,i) => i+parseInt(port));
        block.forEach( (ip, long, index) => {
            for (portx in Ports) {
                (function(portx) {
                    var s = keepAliveAgent.createConnection({
                        host: ip,
                        port: Ports[portx], 
                        family:4}, () =>{
                        console.log('OPEN: ' + ip + ':' + Ports[portx])
                    });
                    s.on('data', function(data){
                        console.log('DATA: ' + ip + ':' + Ports[portx] + ", response: " + data)
                    })
                    s.setTimeout(timeout, function() { 
                        s.destroy(); });

                    s.on('error', function() {
                        s.destroy();
                    });
                    // var s = new net.Socket();
                    // s.setTimeout(timeout, function() { s.destroy(); });
                    // s.connect(Ports[portx], ip, function() {
                    //     console.log('OPEN: ' + ip + ':' + Ports[portx]);
                    // });
                    // s.on('data', function(data) {
                    //     console.log(ip + ':' + port + ': '+ data);
                    //     s.destroy();
                    // });
                    // s.on('error', function(e) {
                    //     s.destroy();
                    // });
                })(portx);
            };
        });
        //console.log(n);
        //console.log(Ports);
        port += 200;
    }
});