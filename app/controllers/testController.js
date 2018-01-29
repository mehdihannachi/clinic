var mongoose = require('mongoose'),
    user = require('./../models/user'),
    admin = require('./../models/admin'),
    nurse = require('./../models/nurse'),
    doctor = require('./../models/doctor'),
    patient = require('./../models/patient'),
    discussion = require('./../models/discussion'),
    message = require('./../models/message'),
    _jsy = require('jsy'),
    uuid = require('uuid'),
    factory = require('../libs/factory'),
    async = require('async'),
    mailer = require('./../models/mailer'),
    ObjectID = require('mongodb').ObjectID,
    base64ImageToFile = require('base64image-to-file');

module.exports.getAllDiscussions = function(req, res) {




    discussion.find().limit(2).populate(' users messages messages.from').exec(function(err, chat) {
        if (err) {
            res.status(404).send('no user found');
        }
        else {
            admin.find().limit(2).exec(function(err, admins) {
                res.json({
                    resultat: 'ahla frer',
                    liste_des_chat: chat,
                    events: admins
                })
            })
        }

    })


}
