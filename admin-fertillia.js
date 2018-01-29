/** @DocteuryServer */
// server.js
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
// var Passport = require('passport').Passport,
//     appPass = new Passport(),
//     adminappPass = new Passport();
var flash = require('connect-flash');
var async = require('async');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// var expressSession = require('cookie-session');
var MongoStore = require('connect-mongo')(session);
var appConfig = require('./config/app.js')
    // var security = require('./app/libs/security.js')
var port = appConfig.port;
var helmet = require('helmet')
var server = require('http').createServer(app);
var path = require('path');
var location = require('countries-cities');
var minifyHTML = require('express-minify-html');
var compression = require('compression');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var io = require('socket.io')(server);
var csrf = require('csurf');
// var RedisStore = require('connect-redis')(session);
var helmet = require('helmet');
var csrfProtection = csrf({
    cookie: true
});
var parseForm = bodyParser.urlencoded({
    extended: false
});
var ExpressWaf = require('express-waf');

var emudb = new ExpressWaf.EmulatedDB();
var waf = new ExpressWaf.ExpressWaf({
    blocker: {
        db: emudb,
        blockTime: 1000
    },
    log: true
});

// var fileUpload = require('express-fileupload');
// var recaptcha = require('express-recaptcha');
// recaptcha.init('6Le6pgoUAAAAAGboed1UtKBNyAyVAu0wbg0Qy-Am', '6Le6pgoUAAAAAN18kj3HT5B8m31WwEhgzCRTHqik' , {
//       onload:'cb',
//       render:'explicit',
//       hl:'fr',
//       theme:'dark',
//       type:'audio',
//       callback:'callback',
//       expired_callback:'expired_callback',
//       size:'size',
//       tabindex:'tabindex'
//     });

// app.use(compression());

mongoose.Promise = global.Promise;
mongoose.connect(appConfig.dbURL);

require('./config/passport')(passport);
// require('./config/adminPassport')(adminappPass);

if (appConfig.env && appConfig.env != "dev") {
    app.use(morgan('short'));
}
else
    app.use(morgan('dev'));

app.use(helmet());
app.use(cookieParser('ses-462320'));


// waf.addModule('csrf-module', {
//     allowedMethods: ['GET', 'POST'],
//     refererIndependentUrls: ['/'],
//     allowedOrigins: ['https://fertillia.com', 'https://admin.fertillia.com']
// }, function(error) {
//     console.log(error);
// });

app.use(waf.check);
/*app.use(fileUpload());*/
app.set('view engine', 'ejs');

app.use(helmet());

// var expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

// const session_store = expressSession({
//     secret: 'ses-462320',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secureProxy: true,
//         httpOnly: true,
//         domain: '.fertillia.com',
//         expires: expiryDate
//     }
// })

// app.use(session_store)

app.use(session({
    secret: 'ses-462320',
    unset: 'destroy',
    saveUninitialized: true,
    httpOnly: true,
    resave: true,
    ephemeral: true,
    cookie: {
        // sameSite : 'lax',
        secure: false,
        overwrite: true,
        domain: 'fertillia.com'
    },
    path: "/",
    store: new MongoStore({
        url: appConfig.dbURL
    })
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// app.use(adminappPass.initialize());
// app.use(adminappPass.session()); // 

app.use(passport.initialize());
app.use(passport.session()); // 

app.use(flash());
app.use(function(req, res, next) {
    res.locals.env = appConfig.env;
    res.locals.user = req.user;
    next()
});
// io.sockets.on('connection', function(socket) {

//     socket.on('newMessage', function(data) {

//         socket.broadcast.emit('newMessage', data);


//     })
// });

// app.use(minifyHTML({
//     override:      true,
//     htmlMinifier: {
//         removeComments:            true,
//         // collapseWhitespace:        true,
//         collapseBooleanAttributes: true,
//         removeAttributeQuotes:     true,
//         removeEmptyAttributes:     true,
//         // minifyJS:                  true
//     }
// }));



app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/uploads'));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/assets'));

app.set('views', __dirname + '/views');
app.use(compression());
// app.use(security.ddos);

var chatController = require('./app/controllers/chatController');


io.sockets.on('connection', function(socket) {
    var req = socket.request;
    var res = req.res;

    socket.on('newMessage', function(data) {
        console.log(data);
        console.log("new message from socket...");
        socket.broadcast.emit('newMessage', data);

    });
    socket.on('messageService', function(data) {
        // chatController.getAllDi(data, req, res)
    })

});

// app.all('/css*', function(req, res, next) {
//     res.header('Expires', new Date(Date.now() + expireTime).toUTCString());
//     next();
// });
// var expireTime = 604800000;
// app.all('/js*', function(req, res, next) {
//     res.header('Expires', new Date(Date.now() + expireTime).toUTCString());
//     res.header('Last-Modified', new Date(Date.now() - expireTime * 4).toUTCString());
//     next();
// });


require('./app/routes.js')(app, passport);
console.log(cluster)

// if (cluster.isMaster) {
//     for (var i = 0; i < 2; i++) {
//         cluster.fork(); // create a worker
//         console.info('cluster forked');
//     }

//     cluster.on('exit', function(worker, code, signal) {

//     });
// }
// else {
//     console.log('is master')
//     server.listen(port);
// }

    server.listen(port);

console.log(appConfig.env + ' running ' + appConfig.name + ' server on port :  ' + port);
