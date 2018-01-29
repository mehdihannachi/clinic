var ExpressBrute = require('express-brute');
var Ddos = require('ddos')
var ddos = new Ddos({
    burst : 15
});
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production 
var bruteforce = new ExpressBrute(store);




module.exports.ddos = ddos.express;
module.exports.bruteforce = bruteforce.prevent;