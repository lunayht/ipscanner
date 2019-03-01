const { askQuestions } = require('./temp');
const ip = require('ip');

const Netmask = require('netmask').Netmask;
const http = require('http');
const ping = require('ping');
const ipAdd = ip.address();

const keepAliveAgent = new http.Agent({
    maxSockets: 100,
});
console.log('Your IP address: ' + ipAdd);
let block = new Netmask(ipAdd + '/24');

askQuestions([
    'Start Port: ',
    'Port Array: ',
]).then(answers => {
    var port = parseInt(answers[0]);
    var portArray = parseInt(answers[1]);
    var Ports = Array.from(Array(portArray), (x,i) => i+port);
    var IPs = [];
    block.forEach( (ip, long, index) => {
        IPs.push(ip);
    });
    IPs.forEach(function(host){
        ping.sys.probe(host, function(isAlive){
            if (isAlive) {
                for (portx in Ports) {
                    (function(portx) {
                        var s = keepAliveAgent.createConnection({
                            host: host,
                            port: Ports[portx], 
                            family:4}, () =>{
                            console.log('OPEN: ' + host + ':' + Ports[portx])
                        });
                        s.on('data', function(data){
                            console.log('DATA: ' + host + ':' + Ports[portx] + ", response: " + data)
                        });
                        s.setTimeout(portArray * 2, function() { 
                            s.destroy(); 
                        });
                        s.on('error', function() {
                            s.destroy();
                        });
                    })(portx);
                };
            }
        });
    });
});



