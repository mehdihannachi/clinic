var async = require('async'),
    moment = require('moment'),
    _jsy = require('jsy'),
    appConfig = require('./../../config/app.js'),
    mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    mailer = require('./../models/mailer'),
    userprofile = require('./../models/admin'),
    User = require('./../models/user'),
    nurse = require('./../models/nurse'),
    admin = require('./../models/admin'),
    doctor = require('./../models/doctor'),
    patient = require('./../models/patient'),
    resetpasswordhash = require('./../models/resetpasswordhash'),
    factory = require('./../libs/factory'),
    shortid = require('shortid'),
    _ = require("underscore");



module.exports.passwordresetGET = function(req, res) {

    var query = resetpasswordhash.findOne({
        hash: req.params.hash,
        "created_at": {
            "$gte": moment().subtract(1, 'hours').toDate()
        },
        "expire": false
    });
    query.populate('user_id');
    query.select().exec(function(err, _hash) {
        if (_hash) {
            res.locals.success = true
            res.locals.error = false
            var newPassword = shortid.generate();
            _hash.user_id.local.password = _hash.user_id.generateHash(newPassword);


            _hash.user_id.save(function(err) {
                if (err)
                    console.log(err)
            });

            _hash.expire = true;
            _hash.save(function(err) {
                if (err) {
                    console.error(err)

                }
                else {


                }
            });

            mailer({
                template: "sendpassword",
                footer: true,
                to: _hash.user_id.local.email,
                subject: "Nouveau mot de passe - Clinique la Rose",
                vars: {
                    new_password: newPassword
                }
            });

            res.render('login', {
                forgetpassword: false,
                nextlogin: true
            });

        }
        else {
            res.render('login', {
                forgetpassword: true,
                nextlogin: false
            });
        }

    });

}

//reset password for fertillia
module.exports.fertilliaPasswordReset = function(req, res) {

    var query = resetpasswordhash.findOne({
        hash: req.params.hash,
        "created_at": {
            "$gte": moment().subtract(1, 'hours').toDate()
        },
        "expire": false
    });
    query.populate('user_id');
    query.select().exec(function(err, _hash) {
        if (_hash) {
            res.locals.success = true
            res.locals.error = false
            var newPassword = shortid.generate();
            _hash.user_id.local.password = _hash.user_id.generateHash(newPassword);


            _hash.user_id.save(function(err) {
                if (err)
                    console.log(err)
            });

            _hash.expire = true;
            _hash.save(function(err) {
                if (err) {
                    console.error(err)

                }
                else {


                }
            });

            mailer({
                template: "sendpassword",
                footer: true,
                to: _hash.user_id.local.email,
                subject: "Nouveau mot de passe - Fertillia",
                vars: {
                    new_password: newPassword
                },
                html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
                attachments: [{
                    filename: 'image.png',
                    path: '../content/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
            });

            var log = 2;
            // res.redirect('https://clinique-la-rose-v2-mehdihan.c9users.io/pass-reset');
            var redirectUrl = 'https://clinique-la-rose-v2-mehdihan.c9users.io/connexion/' + log;
            res.redirect(301, redirectUrl);
            // res.render('login', {
            //     forgetpassword: false,
            //     nextlogin: true
            // });

        }
        else {
            res.redirect('https://clinique-la-rose-v2-mehdihan.c9users.io/connexion');

            // res.render('login', {
            //     forgetpassword: true,
            //     nextlogin: false
            // });
        }

    });

}


module.exports.fertilliaPasswordUpdate = function(req, res) {

    var user = new User();
    var newPassword = user.generateHash(req.body.password);



    User.findOneAndUpdate({
        "local.email": req.body.email
    }, {
        $set: {
            "local.password": newPassword
        }
    }).exec(function(err, result) {
        if (result) {
            res.locals.success = true
            res.locals.error = false

            mailer({
                template: "sendpassword",
                footer: true,
                to: result.local.email,
                subject: "Nouveau mot de passe - Fertillia",
                vars: {
                    new_password: req.body.password
                },
                html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
                attachments: [{
                    filename: 'image.png',
                    path: '../content/logo.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
            });

            res.json({
                success: 'Update Success'
            })
            return false;
        }
    })
}

// forgot password
module.exports.forgotpasswordPOSTajax = function(req, res) {

        User.findOne({
            "local.email": req.body.email
        }, function(err, user) {
            if (user) {
                var hash = shortid.generate();
                resetpasswordhash.create({
                    user_id: user._id,
                    hash: hash
                }, function(err, _hash) {
                    if (err) return handleError(err);
                    else
                        var reset_link = "http://" + appConfig.domain + "/password_reset/" + hash
                    mailer({
                        template: "lostPassword",
                        footer: true,
                        to: user.local.email,
                        subject: "Mots de passe oublié - laRose.Co",
                        vars: {
                            reset_link: reset_link
                        }
                    });

                    // saved!
                });

                res.json({
                    error: false
                })
            }
            else {

                res.json({
                    error: true,
                    message: "Email address not found"
                })
            }
        });
    }
    // forgot password for Fertillia
module.exports.forgotpasswordFertillia = function(req, res) {
    var domain = req.body.domain;
    User.findOne({
        "local.email": req.body.email
    }, function(err, user) {
        if (user) {
            var hash = shortid.generate();
            resetpasswordhash.create({
                user_id: user._id,
                hash: hash
            }, function(err, _hash) {
                if (err) return handleError(err);
                else
                    var reset_link = "http://" + appConfig.domain + "/fertillia/password_reset/" + hash
                mailer({
                    template: "lostPassword",
                    footer: true,
                    to: user.local.email,
                    subject: "Mot de passe oublié - Fertillia.com",
                    vars: {
                        reset_link: reset_link
                    }
                });

                // saved!
            });

            res.json({
                error: false
            })
        }
        else {

            res.json({
                error: true,
                message: "Adresse E-Mail inexistante"
            })
        }
    });
}

module.exports.isConnect = function(req, res, next) {
    if (_jsy(req.user).isEmpty()) {
        res.render('login', {
            forgetpassword: false,
            nextlogin: false
        });
    }
    else {
        if (req.user.local.typeuser == 1) {
            var Aquery = admin.findOne({
                user_id: mongoose.Types.ObjectId(req.user._id)
            });

            Aquery.select().exec(function(err, data) {
                return res.render('index', {
                    user: data,
                    usertype: req.user.local.typeuser

                });
            });
        }
        else if (req.user.local.typeuser == 2) {
            var Nquery = nurse.findOne({
                user_id: mongoose.Types.ObjectId(req.user._id)
            });

            Nquery.select().exec(function(err, data) {
                return res.render('index', {
                    user: data,
                    usertype: req.user.local.typeuser
                });
            });
        }
        else if (req.user.local.typeuser == 3) {
            var Dquery = doctor.findOne({
                user_id: mongoose.Types.ObjectId(req.user._id)
            });

            Dquery.select().exec(function(err, data) {
                return res.render('index', {
                    user: data,
                    usertype: req.user.local.typeuser
                });
            });
        }
        else if (req.user.local.typeuser == 4) {
            var Pquery = patient.findOne({
                user_id: mongoose.Types.ObjectId(req.user._id)
            });

            Pquery.select().exec(function(err, data) {
                return res.render('index', {
                    user: data,
                    usertype: req.user.local.typeuser
                });
            });
        }
    }
}
