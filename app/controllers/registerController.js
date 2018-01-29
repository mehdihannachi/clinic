var mongoose = require('mongoose'),
    admin = require('./../models/admin'),
    nurse = require('./../models/nurse'),
    doctor = require('./../models/doctor'),
    patient = require('./../models/patient'),
    _jsy = require('jsy'),
    uuid = require('uuid'),
    factory = require('../libs/factory'),
    async = require('async'),
    mailer = require('./../models/mailer'),
    ObjectID = require('mongodb').ObjectID,
    base64ImageToFile = require('base64image-to-file');
var fs = require("fs");
// Admin compte Register
exports.adminRegister = function(password, newUser, req) {
    if ((!_jsy((req.body.user.firstName)).lengthBetween(1, 50)) || (!_jsy(req.body.email).isEmail()))
        return false;
    else {
        newUser.local.email = req.body.email;
        newUser.save();
        var _admin = admin();
        _admin.user_id = newUser._id;
        _admin.email = newUser.local.email;
        _admin.firstName = req.body.user.firstName;
        _admin.lastName = req.body.user.lastName;
        _admin.phoneNumber = req.body.user.phoneNumber;


        _admin.profile_picture = 'data:image/png;base64,' + new Buffer(fs.readFileSync('public/img/admin.png')).toString("base64")
        _admin.created_at = new Date();
        _admin.save(function(err) {
            if (!err) {
                //req.session.user = newUser;
                mailer({
                    template: "welcomeUser",
                    footer: true,
                    to: _admin.email,
                    subject: "Création de compte - Clinique la Rose",
                    vars: {
                        email: req.body.email,
                        password: password,
                        fullnameuser: req.body.user.firstName
                    }
                })
            }
            else
                return false;
        });
    }
}

// Admin compte Register By ADMIN
exports.adminByAdminRegister = function(newUser, password, req) {
    var error = false;
    var _admin = admin();

    if (!_jsy(req.body.email).isEmail())
        return false;
    else {
        newUser.local.email = req.body.email;
        newUser.save();

        _admin.user_id = newUser._id;
        _admin.email = newUser.local.email;
        _admin.firstName = req.body.user.firstName;
        _admin.lastName = req.body.user.lastName;
        _admin.phoneNumber = req.body.user.phoneNumber;
        _admin.profile_picture = req.body.user.profilePicture
        _admin.created_at = new Date();
        _admin.save(function(err) {
            if (!err) {
                mailer({
                    template: "sendpassword",
                    footer: true,
                    to: _admin.email,
                    subject: "Création de compte - Clinique la Rose",
                    vars: {
                        new_password: password
                    }
                });

            }
            else
                return false;
        });
    }
}

// Nurse compte Register By ADMIN
exports.nurseByAdminRegister = function(newUser, password, req) {
        var error = false;
        var _nurse = nurse();
        if (!_jsy(req.body.email).isEmail())
            return false;
        else {
            newUser.local.email = req.body.email;
            newUser.save();

            _nurse.user_id = newUser._id;
            _nurse.email = newUser.local.email;
            _nurse.firstName = req.body.user.firstName;
            _nurse.lastName = req.body.user.lastName;
            _nurse.phoneNumber = req.body.user.phoneNumber;
            _nurse.profile_picture = req.body.user.profilePicture
            _nurse.created_at = new Date();
            _nurse.save(function(err) {
                if (!err) {
                    mailer({
                        template: "sendpassword",
                        footer: true,
                        to: _nurse.email,
                        subject: "Création de compte - Clinique la Rose",
                        vars: {
                            new_password: password
                        }
                    });

                }
                else
                    return false;
            });
        }
    }
    
    // Doctor compte Register By ADMIN
exports.doctorByAdminRegister = function(newUser, password, req) {
    var error = false;
    var _doctor = doctor();
    if (!_jsy(req.body.email).isEmail())
        return false;
    else {
        newUser.local.email = req.body.email;
        newUser.save();

        _doctor.user_id = newUser._id;
        _doctor.email = newUser.local.email;
        _doctor.firstName = req.body.user.firstName;
        _doctor.lastName = req.body.user.lastName;
        _doctor.phoneNumber = req.body.user.phoneNumber;
        _doctor.position = req.body.user.position;
        _doctor.profile_picture = req.body.user.profilePicture
        _doctor.created_at = new Date();
        _doctor.save(function(err) {
            if (!err) {
                mailer({
                    template: "sendpassword",
                    footer: true,
                    to: _doctor.email,
                    subject: "Création de compte - Clinique la Rose",
                    vars: {
                        new_password: password
                    }
                });

            }
            else
                return false;
        });
    }
}

// Admin compte Register By ADMIN
exports.patientByAdminRegister = function(newUser, password, req) {
    var error = false;
    var _patient = patient();
    if (!_jsy(req.body.email).isEmail())
        return false;
    else {
        newUser.local.email = req.body.email;
        newUser.save();

        _patient.user_id = newUser._id;
        _patient.email = newUser.local.email;
        _patient.firstName = req.body.user.firstName;
        _patient.lastName = req.body.user.lastName;
        _patient.phoneNumber = req.body.user.phoneNumber;
        _patient.country = req.body.user.country;
        _patient.city = req.body.user.city;
        _patient.location = req.body.user.location;
        _patient.gender = req.body.user.gender;
        _patient.profile_picture = req.body.user.profilePicture
        _patient.birth = req.body.user.birth;
        _patient.created_at = new Date();
        _patient.save(function(err) {
            if (!err) {
                mailer({
                    template: "newAccount",
                    footer: true,
                    to: _patient.email,
                    subject: "Création de compte - Fertillia",
                    vars: {
                        new_password: password,
                        firstName: _patient.firstName,
                        lastName: _patient.lastName,
                    }
                });

            }
            else
                return false;
        });
    }
}
