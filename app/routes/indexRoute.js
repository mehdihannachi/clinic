    module.exports = function(app, passport) {
        var indexController = require('./../controllers/indexController');
        var userController = require('./../controllers/userController')
        var location = require('countries-cities');
        var user = require('./../models/user'),
            admin = require('./../models/admin'),
            doctor = require('./../models/doctor'),
            nurse = require('./../models/nurse'),
            patient = require('./../models/patient');

        var location = require('./../models/location');
        var loc = require('countries-cities');
        var session = function(req, res) {
            var temp = req.session.passport; // {user: 1}
            req.session.regenerate(function(err) {
                //req.session.passport is now undefined
                req.session.passport = temp;
                req.session.save(function(err) {
                    res.send(200);
                });
            });
        };
        //Login
        app.post('/fertillia/login', function(req, res, next) {

                passport.authenticate('fertillia-patient-login', function(err, user, info) {


                    if (info) {
                        if (info.code) {
                            res.json(info)
                        }
                        else {
                            req.login(user, function(err) {
                                if (err) {

                                    return res.json({
                                        error: info.message,

                                    })
                                }
                                req.session.user = user;
                                patient.findOne({
                                    user_id: user._id
                                }).populate(' location ').exec(function(err, p) {
                                    if (err) {
                                        return res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        console.log(p.location)
                                        return res.json({
                                            error: false,
                                            user_id: user._id,
                                            user: p,
                                            verified: info
                                        })
                                    }
                                })
                            });
                        }

                    }
                    else {
                        req.login(user, function(err) {
                            if (err) {
                                console.log("err2")
                                res.json({
                                    error: true,
                                })
                            }
                            req.session.user = user;
                            patient.findOne({
                                user_id: user._id
                            }).populate(' location ').exec(function(err, p) {
                                if (err) {
                                    return res.json({
                                        error: err
                                    });
                                }
                                else {

                                    console.log(p.location)
                                    return res.json({
                                        error: false,
                                        user_id: user._id,
                                        user: p,
                                        verified: info
                                    })
                                }
                            })
                        });
                    }
                })(req, res, next);
            }, session)
            //Login
        app.post('/ajax/login', function(req, res, next) {

                passport.authenticate('local-login', function(err, user, info) {


                    if (info) {
                        if (info.code) {
                            res.json(info)
                        }
                        else {
                            req.login(user, function(err) {
                                if (err) {

                                    return res.json({
                                        error: info.message,

                                    })
                                }
                                req.session.user = user;
                                admin.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        return res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        return res.json({
                                            error: false,
                                            user_id: user._id,
                                            user: p,
                                            verified: info
                                        })
                                    }
                                })
                            });
                        }

                    }
                    else {
                        req.login(user, function(err) {
                            if (err) {
                                console.log("err2")
                                res.json({
                                    error: true,
                                })
                            }
                            req.session.user = user;
                            admin.findOne({
                                user_id: user._id
                            }).exec(function(err, p) {
                                if (err) {
                                    return res.json({
                                        error: err
                                    });
                                }
                                else {


                                    return res.json({
                                        error: false,
                                        user_id: user._id,
                                        user: p,
                                        verified: info
                                    })
                                }
                            })
                        });
                    }
                })(req, res, next);
            }, session)
            //Signup
        app.post('/ajax/signup-admin', function(req, res, next) {
                passport.authenticate('local-signup-admin', function(err, user, info) {

                    if (info) {
                        res.json(info)
                    }
                    else {
                        /*req.login(user, function(err) {
                            if (err) {
                                res.json({
                                    error: true
                                })
                            }
                            //req.session.user = user;
                            res.json({
                                error: false

                            })
                        });*/
                        res.json({
                            error: false
                        })
                    }
                })(req, res, next);

            })
            //Forgot password
        app.post('/ajax/forgotpassword', indexController.forgotpasswordPOSTajax);
        //Forgot password Fertillia
        app.post('/fertillia/forgotpassword', indexController.forgotpasswordFertillia);
        //Forgot password Fertillia
        app.post('/fertillia/passwordUpdate', indexController.fertilliaPasswordUpdate);
        /* GUEST PAGES. */
        /*app.get('/', userController.loadprofile, indexController.load);*/
        app.get('/signup', function(req, res, next) {
            res.render('/ajax/login', {
                user: req.user
            });
        });
        app.get('/', indexController.isConnect);
        app.get('/dashboard', userController.isNotAdmin, function(req, res, next) {
            res.render('views/dashboard', {
                user: req.user
            });
        });
        app.get('/all-users', userController.isLoggedIn, userController.isAdmin, userController.isNotAdmin, function(req, res, next) {
            res.render('views/all-users');
        });
        app.get('/articles', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/articles');
        });
        app.get('/calendar', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/calendar');
        });
        app.get('/common', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/common-2');
        });
        app.get('/doctors', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/doctors');
        });
        app.get('/messages', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/messages');
        });
        app.get('/appointment', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/modal-uppoinment');
        });
        app.get('/reminder', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/modal-reminder');
        });
        app.get('/new-article', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/new-article');
        });
        app.get('/update-article', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/update-article');
        });
        app.get('/new-chat', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/new-chat');
        });
        app.get('/new-doctor', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/new-doctor');
        });
        app.get('/new-nurse', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/new-nurse');
        });
        app.get('/new-admin', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/new-admin');
        });
        app.get('/new-patient', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            location.find({}, function(err, locations) {
                res.render('views/new-patient', {
                    locations: locations
                });
            });
        });
        app.get('/fertillia/locations', function(req, res, next) {
            location.find({}, function(err, locations) {
                res.json(locations);
            });
        });
        app.get('/fertillia/locations/save', function(req, res, next) {
            var resultat;
            var countriees = loc.getCountries(); //get all countries 

            //parcours tous les cities de countries[i]
            for (var i = 0; i < countriees.length; i++) {

                var citiees = loc.getCities(countriees[i])
                if (citiees && (citiees.length > 0)) {
                    var locations = new location();
                    locations.country = countriees[i]
                    locations.cities = citiees
                    locations.save(function(err) {
                        if (err)
                            res.json(err);
                    });
                }
            }
            res.json({
                resultat: resultat
            });

        });
        app.get('/new-user', userController.isLoggedIn, userController.isAdmin, userController.isNotAdmin, function(req, res, next) {
            res.render('views/new-user');
        });
        app.get('/nurses', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/nurses');
        });
        app.get('/admins', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/admins');
        });
        app.get('/patients', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/patients');
        });
        app.get('/profile-doctor', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/profile-doctor');
        });
        app.get('/profile-admin', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/profile-admin');
        });
        app.get('/profile-nurse', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/profile-nurse');
        });
        app.get('/profile-patient', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/profile-patient');
        });
        app.get('/single-chat', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/single-chat');
        });
        app.get('/rdv-demands', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/rdv-demands');
        });
        app.get('/update-admin', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/update-admin');
        });
        app.get('/update-doctor', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/update-doctor');
        });
        app.get('/update-nurse', userController.isLoggedIn, userController.isNotAdmin, userController.isAdmin, function(req, res, next) {
            res.render('views/update-nurse');
        });
        app.get('/update-patient', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            location.find({}, function(err, locations) {
                res.render('views/update-patient', {
                    locations: locations
                });
            });
        });
        
        app.get('/update-user', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/update-user');
        });
        app.get('/stats', userController.isLoggedIn, userController.isNotAdmin, function(req, res, next) {
            res.render('views/stats');
        });
        app.get('/404', function(req, res, next) {
            res.render('views/404');
        });
        app.get('/messagesHistory', function(req, res, next) {
            res.render('views/messagesHistory');
        });
        app.get('/single-chat-history', function(req, res, next) {
            res.render('views/single-chat-history');
        });
        app.get('/password_reset/:hash', indexController.passwordresetGET);
        //reset password for fertillia
        app.get('/fertillia/password_reset/:hash', indexController.fertilliaPasswordReset);
        app.get('/logout', function(req, res) {
            delete req.session.resData;
            delete req.session.mailsent;
            req.logout();
            res.redirect('/');
        });
        //logout for fertillia
        app.get('/fertillia/logout', function(req, res) {
            delete req.session.resData;
            delete req.session.mailsent;
            req.logout();
            res.json({
                error: false,
                message: "Logout avec succes"
            });
        });
    }
    