// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var voucher_codes = require('voucher-code-generator');
// var voucher = require('../app/models/voucher');
var _jsy = require('jsy');

// load up the user model
var User = require('../app/models/user');
var userprofile = require('../app/models/admin');
var mongoose = require('mongoose');
var factory = require('../app/libs/factory');
var ObjectID = require('mongodb').ObjectID;
var registerController = require('../app/controllers/registerController');

// load the auth variables
/*var configAuth = require('./auth'); // use this one for testing
 */
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // passport.use('local-login', new LocalStrategy({
    //         // by default, local strategy uses username and password, we will override with email
    //         usernameField: 'email',
    //         passwordField: 'password',
    //         passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    //     },
    //     function(req, email, password, done) {
    //         if (email)
    //             email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    //         // asynchronous
    //         process.nextTick(function() {
    //             User.findOne({
    //                 'local.email': email
    //             }, function(err, user) {
    //                 // if there are any errors, return the error
    //                 if (err)
    //                     return done(err);

    //                 // if no user is found, return the message
    //                 if (!user)
    //                     return done(null, false, req.flash('loginMessage', 'Aucun utilisateur trouvé.'));

    //                 if (!user.validPassword(password))
    //                     return done(null, false, req.flash('loginMessage', 'Mot de passe incorrect'));
    //                 // all is well, return user
    //                 else
    //                     return done(null, user);
    //             });
    //         });

    //     }));

    passport.use('fertillia-patient-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            console.log("local-login");

            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done({
                            code: 90,
                            error: err
                        });

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, {
                            code: 91,
                            error: 'Aucun utilisateur trouvé.'
                        });

                    if (!user.validPassword(password))
                        return done(null, false, {
                            code: 92,
                            error: 'Mot de passe incorrect.'
                        });
                    // all is well, return user
                    else {
                        console.log('user.typeuser')
                        if ((user) && (user.local) && (user.local.typeuser) &&
                            (user.local.typeuser == 4)) {
                            userprofile.findOne({
                                user_id: user._id
                            }, function(err, userp) {
                                if (userp) {

                                    return done(null, user);
                                }
                                else {
                                    return done(null, user);
                                }


                            });
                        }
                        else {
                            return done(null, false, {
                                code: 93,
                                error: "Acces refusé vous n'avez pas l'autorisation"
                            });
                        }

                    }

                });
            });

        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            console.log("local-login");

            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done({
                            code: 90,
                            error: err
                        });

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, {
                            code: 91,
                            error: 'Aucun utilisateur trouvé.'
                        });

                    if (!user.validPassword(password))
                        return done(null, false, {
                            code: 92,
                            error: 'Mot de passe incorrect.'
                        });
                    // all is well, return user
                    else {
                        console.log('user.typeuser')
                        if ((user) && (user.local) && (user.local.typeuser) &&
                            ((user.local.typeuser == 1) || (user.local.typeuser == 2) || (user.local.typeuser == 3))) {

                            userprofile.findOne({
                                user_id: user._id
                            }, function(err, userp) {
                                if (userp) {
                                    return done(null, user);
                                }
                                else {
                                    return done(null, user);
                                }


                            });
                        }
                        else {
                            return done(null, false, {
                                code: 93,
                                error: "Acces refusé vous n'avez pas l'autorisation"
                            });
                        }

                    }

                });
            });

        }));






    // =========================================================================
    // LOCAL SIGNUP  Admin============================================================
    // =========================================================================
    passport.use('local-signup-admin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });
                }
                else if (!req.user) {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.typeuser = 1;
                            console.log("User: Is admin");
                            var backData = registerController.adminRegister(password, newUser, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduite.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log("err");
                                        console.log(err);
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }

                    });
                }
                else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }

            });
            console.log('ok');
        }));

    // =========================================================================
    // LOCAL SIGNUP  Admin BY ADMIN============================================================
    // =========================================================================
    passport.use('local-signup-admin-By-admin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });
                }
                else {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.typeuser = 1;
                            console.log("User: Is nurse");
                            var backData = registerController.adminByAdminRegister(newUser, password, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduire.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log("err");
                                        console.log(err);
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }

                    });
                }
                /*else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }*/

            });
            console.log('ok');
        }));

    // =========================================================================
    // LOCAL SIGNUP  Nurse BY ADMIN============================================================
    // =========================================================================
    passport.use('local-signup-nurse-By-admin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });
                }
                else {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.typeuser = 2;
                            console.log("User: Is nurse");
                            var backData = registerController.nurseByAdminRegister(newUser, password, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduire.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log("err");
                                        console.log(err);
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }

                    });
                }
                /*else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }*/

            });
            console.log('ok');
        }));

    // =========================================================================
    // LOCAL SIGNUP  Doctor BY ADMIN============================================================
    // =========================================================================
    passport.use('local-signup-doctor-By-admin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });
                }
                else {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.typeuser = 3;
                            console.log("User: Is nurse");
                            var backData = registerController.doctorByAdminRegister(newUser, password, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduire.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log("err");
                                        console.log(err);
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }

                    });
                }
                /*else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }*/

            });
            console.log('ok');
        }));

    // =========================================================================
    // LOCAL SIGNUP  Patient BY ADMIN============================================================
    // =========================================================================
    passport.use('local-signup-patient-By-admin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });
                }
                else {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.typeuser = 4;
                            console.log("User: Is nurse");
                            var backData = registerController.patientByAdminRegister(newUser, password, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduire.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log("err");
                                        console.log(err);
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        }

                    });
                }
                /*else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }*/

            });
            console.log('ok');
        }));



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //console.log(req.body);
            var error = false;
            var returnmessage = [];
            var newUser = new User();
            req.handledData = {};
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:


                if (!_jsy(email).isEmail()) {
                    console.log(1);
                    return done(null, false, {
                        code: 01,
                        error: 'Mail  invalide'
                    });

                }
                else if (!req.user) {
                    console.log(2);
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(3);
                            return done(null, false, {
                                code: 02,
                                error: 'Mail exist'
                            });
                        }
                        else {
                            console.log(4);
                            // create the user
                            newUser.local = {};
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            console.log("User: Is admin");
                            var backData = registerController.adminRegister(newUser, req);
                            if (backData == false) {
                                return done(null, false, {
                                    code: 03,
                                    error: 'vérifier les informations introduire.'
                                })
                            }
                            else {
                                newUser.save(function(err) {
                                    if (err) {
                                        return done(err);
                                        console.log("err");
                                        console.log(err);
                                    }

                                    return done(null, newUser);
                                });
                            }
                            if (req.body.isAdmin == true) {
                                // Patient register
                                console.log("User: Is admin");
                                var backData = registerController.adminRegister(newUser, req);
                                if (backData == false) {
                                    return done(null, false, {
                                        code: 03,
                                        error: 'vérifier les informations introduire.'
                                    })
                                }
                                else {
                                    newUser.save(function(err) {
                                        if (err) {
                                            return done(err);
                                            console.log("err");
                                            console.log(err);
                                        }

                                        return done(null, newUser);
                                    });
                                }
                            }
                            else
                            //Hospital login
                            if (req.body.isHospital == 'true') {
                                // Hospital register
                                console.log("User: Is Hospital");
                                var backData2 = registerController.hospitalRegister(newUser, req);
                                console.log("backData2")
                                console.log(backData2)
                                if (backData2 == false) {
                                    console.log("backData2")
                                    console.log(backData2)
                                    return done(null, false, {
                                        code: 03,
                                        error: 'vérifier les informations introduire.'
                                    })
                                }
                                else {
                                    console.log("save new user")
                                    newUser.save(function(err) {
                                        if (err) {
                                            return done(err);
                                            console.log("err");
                                            console.log(err);
                                        }

                                        return done(null, newUser);
                                    });
                                }
                            }

                        }

                    });
                    // if the user is logged in but has no local account...
                }
                else if (!req.user.local.email) {
                    console.log(16); // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            console.log(17);
                            return done(null, false, {
                                    code: 65,
                                    error: 'Cet e-mail est déjà pris.'
                                })
                                // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        }
                        else {
                            console.log(18);
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                    });
                }
                else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user, {
                        code: 66,
                        error: 'User is logged in and already has a local account. You should log out before trying to create a new account. '
                    })
                }

            });
            console.log('ok');
        }));


    // // =========================================================================
    // // FACEBOOK ================================================================
    // // =========================================================================
    // passport.use(new FacebookStrategy({

    //         clientID: configAuth.facebookAuth.clientID,
    //         clientSecret: configAuth.facebookAuth.clientSecret,
    //         callbackURL: configAuth.facebookAuth.callbackURL,
    //         passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    //     },
    //     function(req, token, refreshToken, profile, done) {

    //         // asynchronous
    //         process.nextTick(function() {
    //             console.log("profile1")
    //             console.log(profile)


    //             // check if the user is already logged in
    //             if (!req.user) {

    //                 User.findOne({
    //                     'facebook.id': profile.id
    //                 }, function(err, user) {
    //                     if (err)
    //                         return done(err);

    //                     if (user) {

    //                         // if there is a user id already but no token (user was linked at one point and then removed)
    //                         if (!user.facebook.token) {
    //                             user.facebook.token = token;
    //                             user.facebook.name = profile.displayName;
    //                             // user.facebook.email = (profile.emails[0].value || '').toLowerCase();

    //                             user.save(function(err) {
    //                                 if (err)
    //                                     return done(err);

    //                                 return done(null, user);
    //                             });
    //                         }

    //                         return done(null, user); // user found, return that user
    //                     } else {
    //                         // if there is no user, create them
    //                         var newUser = new User();
    //                         var patient = new userprofile();
    //                         console.log("profile")
    //                         console.log(profile)

    //                         newUser.facebook.id = profile.id;
    //                         newUser.facebook.token = token;
    //                         newUser.facebook.name = profile.displayName;
    //                         if (profile.emails) {
    //                             newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
    //                             patient.email = newUser.facebook.email

    //                         }

    //                         newUser.save(function(err) {
    //                             if (err)
    //                                 return done(err);

    //                             return done(null, newUser);
    //                         });

    //                         usertype.create({
    //                             user_id: newUser._id,
    //                             type: 0
    //                         });

    //                         var name = newUser.facebook.name.split(' ').slice(0, -1).join(' ');
    //                         var lastname = newUser.facebook.name.split(' ').slice(-1).join(' ');

    //                         var id = new mongoose.Types.ObjectId();
    //                         patient._id = mongoose.Types.ObjectId(id);
    //                         patient.user_id = mongoose.Types.ObjectId(newUser._id);
    //                         patient.verified = 0;
    //                         patient.name = name;
    //                         patient.lastname = lastname;
    //                         patient.save(function() {
    //                             console.log("save facebook")
    //                         });

    //                         addVoucher("01", patient.user_id, function(coupon) {
    //                             console.log("add voucher0")
    //                             console.log(coupon)
    //                             if (coupon) {
    //                                 userprofile.findOne({
    //                                     user_id: newUser._id
    //                                 }, function(err, userp) {
    //                                     userp.voucher = mongoose.Types.ObjectId(coupon);
    //                                     userp.save(function(err) {
    //                                         if (err) {
    //                                             console.log("coupon non saved")
    //                                         }
    //                                     });
    //                                 });
    //                                 console.log("coupon saved")
    //                             }
    //                         });



    //                     }
    //                 });

    //             } else {
    //                 // user already exists and is logged in, we have to link accounts
    //                 var user = req.user; // pull the user out of the session

    //                 user.facebook.id = profile.id;
    //                 user.facebook.token = token;
    //                 user.facebook.name = profile.displayName;;

    //                 // user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
    //                 // user.facebook.email = (profile.emails[0].value || '').toLowerCase();

    //                 user.save(function(err) {
    //                     if (err)
    //                         return done(err);

    //                     return done(null, user);
    //                 });

    //                 usertype.create({
    //                     user_id: user._id,
    //                     type: 0
    //                 });


    //             }
    //         });

    //     }));


    // // =========================================================================
    // // Linkedin =================================================================
    // // =========================================================================
    // passport.use(new LinkedInStrategy({
    //         clientID: configAuth.linkedinAuth.clientID,
    //         clientSecret: configAuth.linkedinAuth.clientSecret,
    //         callbackURL: configAuth.linkedinAuth.callbackURL,
    //         scope: ['r_emailaddress', 'r_basicprofile'],
    //         state: true
    //     },
    //     function(req, token, tokenSecret, profile, done) {
    //         console.log("profile linkedin")
    //         console.log(profile)
    //         console.log("profile.name")
    //         console.log(profile.name)


    //         // asynchronous
    //         process.nextTick(function() {

    //             // check if the user is already logged in
    //             if (!req.user) {

    //                 User.findOne({
    //                     'linkedin.id': profile.id
    //                 }, function(err, user) {
    //                     if (err)
    //                         return done(err);

    //                     if (user) {
    //                         // if there is a user id already but no token (user was linked at one point and then removed)
    //                         if (!user.linkedin.token) {
    //                             user.linkedin.id = profile.id;
    //                             user.linkedin.token = tokenSecret.access_token;
    //                             user.linkedin.username = profile._json.formattedName;
    //                             user.linkedin.displayName = profile.displayName;
    //                             user.linkedin.email = profile._json.emailAddress



    //                             user.save(function(err) {
    //                                 if (err)
    //                                     return done(err);

    //                                 return done(null, user);
    //                             });
    //                         }

    //                         return done(null, user); // user found, return that user
    //                     } else {
    //                         // if there is no user, create them
    //                         var newUser = new User();
    //                         var patient = new userprofile();
    //                         console.log("profileeeeeeeeeeeeeee")



    //                         newUser.linkedin.id = profile.id;
    //                         newUser.linkedin.token = tokenSecret.access_token;
    //                         newUser.linkedin.newUsername = profile._json.formattedName;
    //                         newUser.linkedin.displayName = profile.displayName;
    //                         newUser.linkedin.email = profile._json.emailAddress;
    //                         newUser.linkedin.defaultphoto = profile._json.pictureUrl;

    //                         if (newUser.linkedin.email) {
    //                             patient.email = newUser.linkedin.email
    //                         }

    //                         patient.name = profile.name.givenName;
    //                         patient.lastname = profile.name.familyName;

    //                         newUser.save(function(err) {
    //                             if (err)
    //                                 return done(err);

    //                             return done(null, newUser);
    //                         });

    //                         usertype.create({
    //                             user_id: newUser._id,
    //                             type: 0
    //                         });

    //                         var name = newUser.linkedin.displayName



    //                         var id = new mongoose.Types.ObjectId();
    //                         patient._id = mongoose.Types.ObjectId(id);
    //                         patient.user_id = mongoose.Types.ObjectId(newUser._id);

    //                         patient.verified = 0;

    //                         patient.save(function() {
    //                             console.log("save linkedin")
    //                         });

    //                         addVoucher("01", patient.user_id, function(coupon) {
    //                             console.log("add voucher0")
    //                             console.log(coupon)
    //                             if (coupon) {
    //                                 userprofile.findOne({
    //                                     user_id: newUser._id
    //                                 }, function(err, userp) {
    //                                     userp.voucher = mongoose.Types.ObjectId(coupon);
    //                                     userp.save(function(err) {
    //                                         if (err) {
    //                                             console.log("coupon non saved")
    //                                         }
    //                                     });
    //                                 });
    //                                 console.log("coupon saved")
    //                             }
    //                         });



    //                     }
    //                 });

    //             } else {
    //                 // user already exists and is logged in, we have to link accounts
    //                 var user = req.user; // pull the user out of the session

    //                 user.linkedin.id = profile.id;
    //                 user.linkedin.token = token;
    //                 user.linkedin.username = profile.username;
    //                 user.linkedin.displayName = profile.displayName;

    //                 user.save(function(err) {
    //                     if (err)
    //                         return done(err);

    //                     return done(null, user);
    //                 });
    //             }

    //         });

    //     }));



    // // =========================================================================
    // // TWITTER =================================================================
    // // =========================================================================
    // passport.use(new TwitterStrategy({

    //         consumerKey: configAuth.twitterAuth.consumerKey,
    //         consumerSecret: configAuth.twitterAuth.consumerSecret,
    //         callbackURL: configAuth.twitterAuth.callbackURL,
    //         passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    //     },
    //     function(req, token, tokenSecret, profile, done) {

    //         // asynchronous
    //         process.nextTick(function() {

    //             // check if the user is already logged in
    //             if (!req.user) {

    //                 User.findOne({
    //                     'twitter.id': profile.id
    //                 }, function(err, user) {
    //                     if (err)
    //                         return done(err);

    //                     if (user) {
    //                         // if there is a user id already but no token (user was linked at one point and then removed)
    //                         if (!user.twitter.token) {
    //                             user.twitter.token = token;
    //                             user.twitter.username = profile.username;
    //                             user.twitter.displayName = profile.displayName;

    //                             user.save(function(err) {
    //                                 if (err)
    //                                     return done(err);

    //                                 return done(null, user);
    //                             });
    //                         }

    //                         return done(null, user); // user found, return that user
    //                     } else {
    //                         // if there is no user, create them
    //                         var newUser = new User();
    //                         var patient = new userprofile();
    //                         console.log("profile")
    //                         console.log(profile)

    //                         newUser.twitter.id = profile.id;
    //                         newUser.twitter.token = token;
    //                         newUser.twitter.username = profile.username;
    //                         newUser.twitter.displayName = profile.displayName;
    //                         newUser.twitter.defaultphoto = profile.photos[0].value;
    //                         console.log("defaultphoto")
    //                         console.log(newUser.twitter.defaultphoto)

    //                         newUser.save(function(err) {
    //                             if (err)
    //                                 return done(err);

    //                             return done(null, newUser);
    //                         });

    //                         usertype.create({
    //                             user_id: newUser._id,
    //                             type: 0
    //                         });

    //                         var name = newUser.twitter.displayName



    //                         var id = new mongoose.Types.ObjectId();
    //                         patient._id = mongoose.Types.ObjectId(id);
    //                         patient.user_id = mongoose.Types.ObjectId(newUser._id);
    //                         patient.verified = 0;
    //                         patient.name = name;
    //                         patient.save(function() {
    //                             console.log("save twitter")
    //                         });

    //                         addVoucher("01", patient.user_id, function(coupon) {
    //                             console.log("add voucher0")
    //                             console.log(coupon)
    //                             if (coupon) {
    //                                 userprofile.findOne({
    //                                     user_id: newUser._id
    //                                 }, function(err, userp) {
    //                                     userp.voucher = mongoose.Types.ObjectId(coupon);
    //                                     userp.save(function(err) {
    //                                         if (err) {
    //                                             console.log("coupon non saved")
    //                                         }
    //                                     });
    //                                 });
    //                                 console.log("coupon saved")
    //                             }
    //                         });



    //                     }
    //                 });

    //             } else {
    //                 // user already exists and is logged in, we have to link accounts
    //                 var user = req.user; // pull the user out of the session

    //                 user.twitter.id = profile.id;
    //                 user.twitter.token = token;
    //                 user.twitter.username = profile.username;
    //                 user.twitter.displayName = profile.displayName;

    //                 user.save(function(err) {
    //                     if (err)
    //                         return done(err);

    //                     return done(null, user);
    //                 });
    //             }

    //         });

    //     }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    // passport.use(new GoogleStrategy({

    //         clientID: configAuth.googleAuth.clientID,
    //         clientSecret: configAuth.googleAuth.clientSecret,
    //         callbackURL: configAuth.googleAuth.callbackURL,
    //         passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    //     },
    //     function(req, token, refreshToken, profile, done) {

    //         // asynchronous
    //         process.nextTick(function() {

    //             // check if the user is already logged in
    //             if (!req.user) {

    //                 User.findOne({
    //                     'google.id': profile.id
    //                 }, function(err, user) {
    //                     if (err)
    //                         return done(err);

    //                     if (user) {

    //                         // if there is a user id already but no token (user was linked at one point and then removed)
    //                         if (!user.google.token) {
    //                             user.google.token = token;
    //                             user.google.name = profile.displayName;
    //                             user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

    //                             user.save(function(err) {
    //                                 if (err)
    //                                     return done(err);

    //                                 return done(null, user);
    //                             });
    //                         }

    //                         return done(null, user);
    //                     } else {
    //                         var newUser = new User();

    //                         newUser.google.id = profile.id;
    //                         newUser.google.token = token;
    //                         newUser.google.name = profile.displayName;
    //                         newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

    //                         newUser.save(function(err) {
    //                             if (err)
    //                                 return done(err);

    //                             return done(null, newUser);
    //                         });
    //                     }
    //                 });

    //             } else {
    //                 // user already exists and is logged in, we have to link accounts
    //                 var user = req.user; // pull the user out of the session

    //                 user.google.id = profile.id;
    //                 user.google.token = token;
    //                 user.google.name = profile.displayName;
    //                 user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

    //                 user.save(function(err) {
    //                     if (err)
    //                         return done(err);

    //                     return done(null, user);
    //                 });

    //             }

    //         });

    //     }));

};
