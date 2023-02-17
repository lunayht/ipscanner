const {
    askQuestions
} = require('./question');
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
    'Array Range: ',
]).then(answers => {
    var port = parseInt(answers[0]);
    var portArray = parseInt(answers[1]);
    var Ports = Array.from(Array(portArray), (x, i) => i + port);
    block.forEach((ip, long, index) => {
        ping.sys.probe(ip, function(isAlive) {
            if (isAlive) {
                for (portx in Ports) {
                    (function(portx) {
                        var s = keepAliveAgent.createConnection({
                            host: ip,
                            port: Ports[portx],
                            family: 4
                        }, () => {
                            console.log('OPEN: ' + ip + ':' + Ports[portx])
                        });
                        s.on('data', function(data) {
                            console.log('DATA: ' + ip + ':' + Ports[portx] + ", response: " + data)
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