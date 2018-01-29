var async = require('async'),
    moment = require('moment'),
    _jsy = require('jsy'),
    appConfig = require('./../../config/app.js'),
    mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    news = require('./../models/news'),
    User = require('./../models/user'),
    Admin = require('./../models/admin'),
    resetpasswordhash = require('./../models/resetpasswordhash'),
    factory = require('./../libs/factory'),
    shortid = require('shortid'),
    base64ImageToFile = require('base64image-to-file'),
    _jsy = require('jsy'),
    uuid = require('uuid'),
    _ = require("underscore");

module.exports.index = function(req, res, next) {
    news.find().sort('-created_at').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json({
                articles
            });
        }
    });
};

module.exports.showPublished = function(req, res, next) {
    news.find({
        as_draft: false
    }).sort('-created_at').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json({
                articles
            });
        }
    });
};

module.exports.paginate = function(req, res) {
    var limit = 2;
    console.log("///////// paginateitems///////////")
    console.log(req.params.currentPage)
    var offset = req.params.currentPage + limit;
    console.log(offset)
    news.find({})
        .skip(offset)
        .limit(limit)
        .exec(function(err, articles) {
            if (err) {
                console.log("/////////error paginate///////////")
                console.log(err)
            }
            news.count().exec(function(err, count) {
                if (err) {
                    console.log("/////////err paginate///////////")
                    console.log(err)
                }
                else {
                    return res.json({
                        nb: count,
                        articles: articles
                    });
                }
            })
        });
}

module.exports.show = function(req, res, next) {
    news.findOne({
        _id: req.params.id
    }).exec(function(err, p) {
        if (err) {
            res.json({
                error: err
            });
        }
        else {
            console.log(p)
            res.json(p);
        }
    })
};

module.exports.create = function(req, res) {
    var p = new news();
    var picture64 = req.body.cover_photo;
    var cover_photo = uuid.v4();
    async.series([
        function(next) {
            if (req.body.cover_photo)
                base64ImageToFile(picture64, 'public/img', cover_photo, function(err, imgPath) {
                    if (err) {;
                        return console.error(err);
                    }
                    p.cover_photo = imgPath.replace('public/img/', '');
                    next()
                });
            else
                next();
        },

        function(next) {
            p.title = req.body.title;
            p.content = req.body.content;
            p.introduction = req.body.introduction;
            p._user = req.user._id;

            p.save(function(err, bl) {
                if (err) {
                    res.json({
                        error: err
                    });
                }
                else {
                    console.log('saved article')
                    console.log(p)
                    res.json({
                        success: true,
                        response: 200,
                        message: 'news created'
                    })
                }
            });
        }
    ])
};

module.exports.delete = function(req, res) {
    news.findById(req.params.id, function(err, news) {
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

module.exports.update = function(req, res) {

    var picture64 = req.body.cover_photo;
    var cover_photo = uuid.v4();
    var photo_link = '';
    async.series([
        function(next) {
            if (req.body.cover_photo)
                base64ImageToFile(picture64, 'public/img', cover_photo, function(err, imgPath) {
                    if (err) {;
                        return console.error(err);
                    }
                    cover_photo = imgPath.replace('public/img/', '');
                    next()
                });
            else
                next();
        },

        function(next) {
            news.findByIdAndUpdate(req.params.id, {
                $set: {
                    as_draft: req.body.draft,
                    title: req.body.title,
                    content: req.body.content,
                    introduction: req.body.introduction,
                    cover_photo: cover_photo,
                    _user: req.user._id
                }
            }, {
                new: true
            }, function(err, p) {
                if (err)
                    res.json({
                        error: err
                    });

                else
                    res.json(p);


            });
        }
    ])
};

module.exports.saveDraft = function(req, res) {
    var p = new news();
    var picture64 = req.body.cover_photo;
    var cover_photo = uuid.v4();
    async.series([
        function(next) {
            if (req.body.cover_photo)
                base64ImageToFile(picture64, 'public/img', cover_photo, function(err, imgPath) {
                    if (err) {;
                        return console.error(err);
                    }
                    p.cover_photo = imgPath.replace('public/img/', '');
                    next()
                });
            else
                next();
        },

        function(next) {
            p.title = req.body.title;
            p.content = req.body.content;
            p._user = req.user._id;
            p.as_draft = true;

            p.save(function(err, bl) {
                if (err) {
                    res.json({
                        error: err
                    });
                }
                else {
                    res.json({
                        success: true,
                        response: 200,
                        message: 'news created as draft'
                    })
                }
            });
        }
    ])

};

module.exports.publishDraft = function(req, res) {
    var picture64 = req.body.cover_photo;
    var cover_photo = uuid.v4();
    async.series([
        function(next) {
            if (req.body.cover_photo)
                base64ImageToFile(picture64, 'public/img', cover_photo, function(err, imgPath) {
                    if (err) {;
                        return console.error(err);
                    }
                    p.cover_photo = imgPath.replace('public/img/', '');
                    next()
                });
            else
                next();
        },

        function(next) {
            news.findByIdAndUpdate(req.params.id, {
                $set: {
                    as_draft: req.body.draft,
                    title: req.body.title,
                    content: req.body.content,
                    _user: req.user._id
                }
            }, {
                new: true
            }, function(err, p) {
                if (err)
                    res.json({
                        error: err
                    });

                else
                    res.json(p);


            });
        }
    ])
};

module.exports.deleteSelected = function(req, res) {
    for (key in req.body.articles) {
        checkForValue(key, req.body.articles[key]);
    }

    function checkForValue(key, value) {

        if (value == true) {
            news.findOne({
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

module.exports.draftSelected = function(req, res) {
    for (key in req.body.articles) {
        checkForValue(key, req.body.articles[key]);
    }

    function checkForValue(key, value) {

        if (value == true) {
            news.findByIdAndUpdate(key, {
                $set: {
                    as_draft: true
                }
            }, {
                new: true
            }, function(err, p) {
                if (err)
                    res.json({
                        error: err
                    });
            });
        }
    }
    res.json({
        message: 'everything should be fine'
    })
}
