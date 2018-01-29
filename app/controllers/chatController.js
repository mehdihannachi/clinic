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
var io = require('socket.io');


module.exports.getAllDiscussionsHistory = function(req, res) {
    var allChat;

    async.waterfall([
        function(next) {
            discussion.find({
                "users": mongoose.Types.ObjectId(req.params.id)
            }).populate(' users users.local').exec(function(err, result) {
                if (err) {
                    res.json({
                        error: true,
                        message: 'erreur fetch discussions'
                    })
                }
                else if (result.length == 0) {
                    res.json({
                        error: true,
                        message: 'pas de discussions'
                    })
                }
                else {

                    for (var i = result.length - 1; i >= 0; i--) {

                        if (result[i].messages.length == 0) {
                            result.splice(i, 1);
                        }
                    }
                    allChat = result;
                    next();
                }
            })
        },
        function(next) {
            var result = allChat
            var toReturn = []
            async.eachSeries(result, function(data, callbackAllChat) {
                    var correspondant = {}
                    async.eachSeries(data.users, function(user, callback, callbackAllChat) {
                            if (user._id.equals(req.params.id)) {
                                callback();
                            }
                            else {
                                if (user.local.typeuser == 1) {
                                    admin.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 2) {
                                    nurse.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 3) {
                                    doctor.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 4) {
                                    patient.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                            }
                        },
                        function(err) {
                            if (err) {
                                throw err;
                            }
                            callbackAllChat()
                        });
                },
                function(err) {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        data: toReturn
                    })
                });
        }
    ])
}

module.exports.getAllDiscussions = function(req, res) {
    var allChat;

    async.waterfall([
        function(next) {
            discussion.find({
                "users": mongoose.Types.ObjectId(req.user._id)
            }).populate(' users users.local').exec(function(err, result) {
                if (err) {
                    res.json({
                        error: true,
                        message: 'erreur fetch discussions'
                    })
                }
                else if (result.length == 0) {
                    res.json({
                        error: true,
                        message: 'pas de discussions'
                    })
                }
                else {

                    for (var i = result.length - 1; i >= 0; i--) {

                        if (result[i].messages.length == 0) {
                            result.splice(i, 1);
                        }
                    }
                    allChat = result;
                    next();
                }
            })
        },
        function(next) {
            var result = allChat
            var toReturn = []
            async.eachSeries(result, function(data, callbackAllChat) {
                    var correspondant = {}
                    async.eachSeries(data.users, function(user, callback, callbackAllChat) {
                            if (user._id.equals(req.user._id)) {
                                callback();
                            }
                            else {
                                if (user.local.typeuser == 1) {
                                    admin.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 2) {
                                    nurse.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 3) {
                                    doctor.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                                else if (user.local.typeuser == 4) {
                                    patient.findOne({
                                        user_id: user._id
                                    }).exec(function(err, p) {
                                        if (err) {
                                            res.json({
                                                error: err
                                            });
                                        }
                                        else {
                                            correspondant = p
                                            data.correspondant = {}
                                            data.correspondant.firstName = correspondant.firstName
                                            data.correspondant.lastName = correspondant.lastName
                                            data.correspondant.profile_picture = correspondant.profile_picture
                                            data.correspondant._id = correspondant.id
                                            data.correspondant.user_id = correspondant.user_id
                                            toReturn.push(data)
                                            callback();
                                        }
                                    })
                                }
                            }
                        },
                        function(err) {
                            if (err) {
                                throw err;
                            }
                            callbackAllChat()
                        });
                },
                function(err) {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        data: toReturn
                    })
                });
        }
    ])
}

module.exports.getDiscussionHistory = function(req, res) {
    discussion.findById(req.params.id, function(err, data) {
        if (!err) {
            var correspondant = {}
            async.eachSeries(data.users, function(user, callback) {
                    if (user._id.equals(req.params.user_id)) {
                        callback();
                    }
                    else {

                        switch (user.local.typeuser) {
                            case 1:
                                admin.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                            case 2:
                                nurse.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                                // }
                                // else if (user.local.typeuser == 3) {
                                //     doctor.findOne({
                                //         user_id: user._id
                                //     }).exec(function(err, p) {
                                //         if (err) {
                                //             res.json({
                                //                 error: err
                                //             });
                                //         }
                                //         else {
                                //             correspondant = p
                                //             data.correspondant = correspondant;
                                //             callback();
                                //         }
                                //     })
                                // }
                            case 4:
                                patient.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                        }
                    }
                },
                function(err) {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        data: data
                    })
                });
        }
        else {
            res.json({
                error: true,
                message: 'erreur fetch discussions'
            })
        }
    }).populate('users messages');
}
module.exports.getDiscussion = function(req, res) {
    discussion.findById(req.params.id, function(err, data) {
        if (!err) {
            var correspondant = {}
            async.eachSeries(data.users, function(user, callback) {
                    if (user._id.equals(req.user._id)) {
                        callback();
                    }
                    else {

                        switch (user.local.typeuser) {
                            case 1:
                                admin.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                            case 2:
                                nurse.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                                // }
                                // else if (user.local.typeuser == 3) {
                                //     doctor.findOne({
                                //         user_id: user._id
                                //     }).exec(function(err, p) {
                                //         if (err) {
                                //             res.json({
                                //                 error: err
                                //             });
                                //         }
                                //         else {
                                //             correspondant = p
                                //             data.correspondant = correspondant;
                                //             callback();
                                //         }
                                //     })
                                // }
                            case 4:
                                patient.findOne({
                                    user_id: user._id
                                }).exec(function(err, p) {
                                    if (err) {
                                        res.json({
                                            error: err
                                        });
                                    }
                                    else {
                                        correspondant = p
                                        data.correspondant = correspondant;
                                        callback();
                                    }
                                })
                                break;
                        }
                    }
                },
                function(err) {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        data: data
                    })
                });
        }
        else {
            res.json({
                error: true,
                message: 'erreur fetch discussions'
            })
        }
    }).populate('users messages');
}

module.exports.startDiscussion = function(req, res) {
    var connectedUser = req.user;
    var connected = mongoose.Types.ObjectId(req.user._id);
    var corres = mongoose.Types.ObjectId(req.body.correspondant_id);
    console.log('connected')
    console.log(connected)
    console.log('corres')
    console.log(corres)
    console.log(req.user._id)
    var msg;
    console.log('1')
    async.series([
        function(next) {
            discussion.findOne({
                $or: [{
                    'users': [connected, corres]
                }, {
                    'users': [corres, connected]
                }]
            }).exec(function(err, chat) {
                if (chat) {
                    next();
                }
                else {
                    console.log('2')

                    user.findOne({
                        _id: req.body.correspondant_id
                    }, function(err, correspondant) {
                        if (err) {}
                        if (correspondant) {
                            console.log('3')

                            var newMsg = new message();
                            newMsg.from = req.user._id;
                            newMsg.content = 'Bonjour, je souhaite vous contacter';
                            newMsg.to = req.body.correspondant_id;
                            newMsg.save(function(err, mesg) {
                                if (err) {
                                    return res.json({
                                        error: true
                                    })
                                }
                                else {
                                    msg = mesg;
                                    var _discussion = discussion();
                                    console.log('4')

                                    _discussion.users.push(connectedUser);
                                    _discussion.users.push(correspondant);
                                    // _discussion.messages.push(msg);
                                    _discussion.save(function(err) {
                                        if (!err) {
                                            discussion.findById(_discussion._id, function(err, result) {
                                                if (!err) {
                                                    async.eachSeries(result.users, function(user, callback) {
                                                            if (user._id.equals(req.user._id)) {
                                                                callback();
                                                                console.log('5')

                                                            }
                                                            else {
                                                                console.log('6')

                                                                switch (user.local.typeuser) {
                                                                    case 1:
                                                                        admin.findOne({
                                                                            user_id: user._id
                                                                        }).exec(function(err, p) {
                                                                            if (err) {
                                                                                res.json({
                                                                                    error: err
                                                                                });
                                                                            }
                                                                            else {
                                                                                correspondant = p
                                                                                result.correspondant = correspondant;
                                                                                callback();
                                                                            }
                                                                        })
                                                                        break;
                                                                    case 2:
                                                                        nurse.findOne({
                                                                            user_id: user._id
                                                                        }).exec(function(err, p) {
                                                                            if (err) {
                                                                                res.json({
                                                                                    error: err
                                                                                });
                                                                            }
                                                                            else {
                                                                                console.log('7')

                                                                                correspondant = p
                                                                                result.correspondant = correspondant;
                                                                                callback();
                                                                            }
                                                                        })
                                                                        break;
                                                                        // }
                                                                        // else if (user.local.typeuser == 3) {
                                                                        //     doctor.findOne({
                                                                        //         user_id: user._id
                                                                        //     }).exec(function(err, p) {
                                                                        //         if (err) {
                                                                        //             res.json({
                                                                        //                 error: err
                                                                        //             });
                                                                        //         }
                                                                        //         else {
                                                                        //             correspondant = p
                                                                        //             data.correspondant = correspondant;
                                                                        //             callback();
                                                                        //         }
                                                                        //     })
                                                                        // }
                                                                    case 4:
                                                                        patient.findOne({
                                                                            user_id: user._id
                                                                        }).exec(function(err, p) {
                                                                            if (err) {
                                                                                res.json({
                                                                                    error: err
                                                                                });
                                                                            }
                                                                            else {
                                                                                correspondant = p
                                                                                result.correspondant = correspondant;
                                                                                callback();
                                                                            }
                                                                        })
                                                                        break;
                                                                }
                                                            }
                                                        },
                                                        function(err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                            res.json({
                                                                data: result
                                                            })
                                                        });
                                                }
                                                else {
                                                    res.json({
                                                        error: true,
                                                        message: 'erreur fetch discussions'
                                                    })
                                                }
                                            }).populate('users messages');
                                        }
                                        else {
                                            return false;
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        },
        function(next) {
            console.log('7')

            discussion.find({
                $or: [{
                    'users': [connected, corres]
                }, {
                    'users': [corres, connected]
                }]
            }, function(err, discussion) {

                if (discussion) {
                    async.eachSeries(discussion[0].users, function(user, callback) {
                            if (user._id.equals(req.user._id)) {
                                callback();
                            }
                            else {
                                console.log('8')

                                switch (user.local.typeuser) {
                                    case 1:
                                        admin.findOne({
                                            user_id: user._id
                                        }).exec(function(err, p) {
                                            if (err) {
                                                res.json({
                                                    error: err
                                                });
                                            }
                                            else {
                                                var correspondant = p
                                                discussion[0].correspondant = correspondant;
                                                callback();
                                            }
                                        })
                                        break;
                                    case 2:
                                        nurse.findOne({
                                            user_id: user._id
                                        }).exec(function(err, p) {
                                            if (err) {
                                                res.json({
                                                    error: err
                                                });
                                            }
                                            else {
                                                console.log('9')

                                                var correspondant = p
                                                discussion[0].correspondant = correspondant;
                                                callback();
                                            }
                                        })
                                        break;
                                        // }
                                        // else if (user.local.typeuser == 3) {
                                        //     doctor.findOne({
                                        //         user_id: user._id
                                        //     }).exec(function(err, p) {
                                        //         if (err) {
                                        //             res.json({
                                        //                 error: err
                                        //             });
                                        //         }
                                        //         else {
                                        //             correspondant = p
                                        //             data.correspondant = correspondant;
                                        //             callback();
                                        //         }
                                        //     })
                                        // }
                                    case 4:
                                        patient.findOne({
                                            user_id: user._id
                                        }).exec(function(err, p) {
                                            if (err) {
                                                res.json({
                                                    error: err
                                                });
                                            }
                                            else {
                                                var correspondant = p
                                                discussion[0].correspondant = correspondant;
                                                callback();
                                            }
                                        })
                                        break;
                                }
                            }
                        },
                        function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log('10')

                            res.json({
                                data: discussion[0]
                            })
                            return false;
                        });
                }
            }).populate('users messages');
        }
    ])
}


module.exports.getAllDi = function(data, req, res) {
    console.log(req.session)
    console.log('im sending with socket')
    console.log(data)

    var data = new discussion();
    var msg = {}
    discussion.findById(data.discussionId, function(err, result) {
        if (!err) {
            data = result;

        }
        else {
            res.json({
                error: true,
                message: 'erreur fetch discussions'
            })
        }
    });

    async.series([
        function(next) {

            var newMsg = new message();
            newMsg.from = req.user._id;
            newMsg.content = data.message;
            newMsg.to = data.correspondant_id;
            newMsg.discussion = data.discussionId;


            newMsg.save(function(err, mesg) {
                if (err) {
                    return res.json({
                        error: true
                    })

                }
                else {
                    msg = mesg;
                    next();
                }


            })


        },
        function(next) {

            data.messages.push(msg);

            data.save(function(err, newdiscussion) {
                if (err) {
                    return res.json({
                        error: true
                    })

                }
                else {
                    var response = {}
                    response.discussion = newdiscussion;
                    response.message = msg;
                    io.sockets.on('connection', function(socket) {

                        socket.broadcast.emit('newMessage', response);

                    });
                    return res.json({
                        error: false,
                        discussion: newdiscussion,
                        message: msg

                    });
                }


            })
        }

    ])




}
module.exports.sendMsg = function(req, res) {
    console.log('1')
    if (req.user._id) {
        var data = new discussion();
        var msg = {}
        async.series([
            function(next) {
                discussion.findById(req.body.discussionId, function(err, result) {
                    if (!err) {
                        data = result;
                        console.log('2')
                        next();

                    }
                    else {
                        res.json({
                            error: true,
                            message: 'erreur fetch discussions'
                        })
                    }
                })
            },
            function(next) {
                console.log('3')

                var newMsg = new message();
                newMsg.from = req.user._id;
                newMsg.content = req.body.message;
                newMsg.to = req.body.correspondant_id;
                newMsg.discussion = req.body.discussionId;


                newMsg.save(function(err, mesg) {
                    if (err) {
                        return res.json({
                            error: true
                        })

                    }
                    else {
                        console.log('4')

                        msg = mesg;
                        next();
                    }


                })


            },
            function(next) {
                console.log('5')

                data.messages.push(msg);
                console.log('6')

                data.save(function(err, newdiscussion) {
                    if (err) {
                        return res.json({
                            error: true
                        })

                    }
                    else {

                        return res.json({
                            error: false,
                            discussion: newdiscussion,
                            message: msg

                        });
                    }


                })
            }

        ])

    }
    else {
        return res.json({
            error: true
        })
    }
};

module.exports.delete = function(req, res) {
    discussion.findById(req.params.id, function(err, news) {
        news.remove();
        if (err) {
            res.json({
                error: err
            });
        }
        else {
            res.json({
                success: true,
                response: 200,
                message: 'news deleted'
            })
        }
    })
};

module.exports.deleteSelected = function(req, res) {
    for (key in req.body.discussions) {
        checkForValue(key, req.body.discussions[key]);
    }

    function checkForValue(key, value) {

        if (value == true) {
            discussion.findOne({
                _id: key
            }, function(err, result) {
                if (err) {

                }
                if (result) {
                    result.remove();

                    return false
                }
            })
        }
    }
    res.json({
        message: 'everything should be fine'
    })
}

module.exports.seenOnMessages = function(req, res) {
    for (key in req.body.messages) {
        if (req.body.messages[key].to == req.body.messagesTo.user_id)
            checkForValue(key, req.body.messages[key]);
    }

    function checkForValue(key, value) {

        message.findByIdAndUpdate(value._id, {
            $set: {
                seen: true
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) {

            }
            if (result) {
                return null;
            }
        })

    }
    res.json({
        message: 'seen = true'
    })
}
