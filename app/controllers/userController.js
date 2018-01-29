var async = require('async'),
  _jsy = require('jsy'),
  user = require('./../models/user'),
  admin = require('./../models/admin'),
  doctor = require('./../models/doctor'),
  nurse = require('./../models/nurse'),
  patient = require('./../models/patient'),
  mailer = require('./../models/mailer'),
  calendar = require('./../models/calendar'),
  rdvDemand = require('./../models/rdvDemand'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  base64ImageToFile = require('base64image-to-file'),
  passport = require('passport'),
  formidable = require('formidable'),
  fs = require('fs'),
  multer = require("multer"),
  path = require('path'),
  mkdirp = require('mkdirp');



module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated())
      return next();
    req.session.nextURL = req.originalUrl;
    res.redirect('/login');
  },

  // route middleware to ensure user is logged in
  ajaxisLoggedIn: function(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.json({
      code: 80,
      error: 'You must logged in.'
    });
  },

  isNotLoggedIn: function(req, res, next) {
    if (!req.isAuthenticated())
      return next();

    res.redirect('/');
  }

}

//-----Get all users-----//
module.exports.index = function(req, res, next) {


  admin.find().exec(function(err, n) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {
      var admins = n;
      doctor.find().exec(function(err, n) {
        if (err) {
          res.json({
            error: err
          });
        }
        else {

          var doctors = n;

          nurse.find().exec(function(err, n) {
            if (err) {
              res.json({
                error: err
              });
            }
            else {
              var nurses = n;

              patient.find().exec(function(err, n) {
                if (err) {
                  res.json({
                    error: err
                  });
                }
                else {
                  var patients = n;
                  res.json({
                    admin: admins,
                    doctor: doctors,
                    nurse: nurses,
                    patient: patients
                  })
                }
              });
            }
          });
        }
      });
    }
  });





}

module.exports.nurses = function(req, res, next) {
  nurse.find().exec(function(err, nurses) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {
      res.json({
        nurse: nurses
      })
    }
  });
}

//creation des users could be made with one web service instead of 3 or 4

//-----Creation of new user profile ( By admin)-----//
module.exports.newAdmin = function(req, res, next) {
  passport.authenticate('local-signup-admin-By-admin', function(err, user, info) {

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
}

module.exports.newNurse = function(req, res, next) {
  passport.authenticate('local-signup-nurse-By-admin', function(err, user, info) {

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
}

module.exports.newDoctor = function(req, res, next) {
  passport.authenticate('local-signup-doctor-By-admin', function(err, user, info) {

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
}

module.exports.newPatient = function(req, res, next) {
  passport.authenticate('local-signup-patient-By-admin', function(err, user, info) {

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
}

//-----Suppression de profile (plusieur par selection)-----//
module.exports.delete = function(req, res) {
  for (key in req.body.users) {
    checkForValue(key, req.body.users[key]);
  }

  function checkForValue(key, value) {

    if (value == true) {
      admin.findOne({
        _id: key
      }, function(err, result) {
        if (err) {

        }
        if (result) {
          user.findById(result.user_id, function(err, res) {
            res.remove();
            if (err) {
              res.json({
                error: err
              });
            }
            else {
              result.remove();

            }
          })
          return false
        }
        doctor.findOne({
          _id: key
        }, function(err, result) {
          if (err) {}
          if (result) {
            user.findById(result.user_id, function(err, res) {
              res.remove();
              if (err) {
                res.json({
                  error: err
                });
              }
              else {
                result.remove();

              }
            })
            return false
          }
          nurse.findOne({
            _id: key
          }, function(err, result) {
            if (err) {}
            if (result) {
              user.findById(result.user_id, function(err, res) {
                res.remove();
                if (err) {
                  res.json({
                    error: err
                  });
                }
                else {
                  result.remove();

                }
              })
              return false
            }
            patient.findOne({
              _id: key
            }, function(err, result) {
              if (err) {}
              if (result) {
                user.findById(result.user_id, function(err, res) {
                  res.remove();
                  if (err) {
                    res.json({
                      error: err
                    });
                  }
                  else {
                    result.remove();

                  }
                })
                return false
              }
            })
          })
        })
      })
    }
    return false
  }

  res.json({
    success: true
  })
}

//-----get the user Type so we could show the user profile-----//
module.exports.userProfile = function(req, res) {
  user.findOne({
    _id: req.params.id
  }, function(err, result) {
    if (err) {

    }
    if (result) {
      res.json({
        typeuser: result.local.typeuser
      });

    }
  })
}

//-----get the profile detail-----//
module.exports.adminProfile = function(req, res) {
  admin.findOne({
    user_id: req.params.id
  }).exec(function(err, p) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {

      res.json(p);
    }
  })
};

module.exports.doctorProfile = function(req, res) {
  doctor.findOne({
    user_id: req.params.id
  }).exec(function(err, p) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {
      res.json(p);
    }
  })
};

module.exports.nurseProfile = function(req, res) {
  nurse.findOne({
    user_id: req.params.id
  }).exec(function(err, p) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {

      res.json(p);
    }
  })
};

module.exports.patientProfile = function(req, res) {
  patient.findOne({
    user_id: req.params.id
  }, function(err, result) {
    if (!err) {
      res.json(result)

    }
    else {
      res.json({
        error: err
      });
    }
  }).populate('location');
};

//-----Update of the user profile (update made by admin)-----//
module.exports.adminUpdate = function(req, res) {
  var email = req.body.user.email;
  var passhash = new user();
  var userParams;
  if ((req.body.user.email != req.user.local.email) && req.body.user.password) {
    userParams = {
      'local.password': passhash.generateHash(req.body.user.password),
      'local.email': req.body.user.email
    }
    var mail = 'withPassAndMail';
  }
  else if (req.body.user.password) {
    userParams = {
      'local.password': passhash.generateHash(req.body.user.password),
      'local.email': req.body.user.email
    }
    var mail = 'withPass';
  }
  else if ((req.body.user.email != req.user.local.email)) {
    userParams = {
      'local.email': req.body.user.email
    }
    var mail = 'withMail';
  }
  else {
    userParams = {
      'local.email': req.body.user.email
    }
  }

  parameters = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    phoneNumber: req.body.user.phoneNumber,
    email: req.body.user.email,
    profile_picture: req.body.user.profilePicture
  };
  var error = false;

  if (!_jsy(email).isEmail()) {
    return res.json({
      error: 'Mail  invalide'
    })
  }
  else {
    user.findOne({
      'local.email': email
    }, function(err, result) {
      // if there are any errors, return the error
      if (err) {
        return res.json({
          error: true
        })
      }
      else if (result) {
        // check to see if theres already a user with that email
        if (result.id == req.body.user_id) {
          user.findByIdAndUpdate(req.body.user_id, {
            $set: userParams
          }, {
            new: true
          }, function(err, p) {
            if (err) {
              return res.json({
                error: true
              });
            }
            else {
              admin.findByIdAndUpdate(req.params.id, {
                $set: parameters
              }, {
                new: true
              }, function(err, p) {
                if (err) {
                  return res.json({
                    error: true
                  });
                }
                else {

                  if (mail == 'withPassAndMail') {
                    mailer({
                      template: "updateUserWithPassAndMail",
                      footer: true,
                      to: req.body.user.email,
                      subject: "Mise à jour de votre compte - Fertillia",
                      vars: {
                        fullnameuser: req.body.user.firstName,
                        password: req.body.user.password,
                        email: req.body.user.email
                      }
                    });
                    return res.json({
                      success: 'Update Success',
                      error: false
                    })
                  }
                  else if (mail == 'withMail') {
                    mailer({
                      template: "updateUserWithMail",
                      footer: true,
                      to: req.body.user.email,
                      subject: "Mise à jour de votre compte - Fertillia",
                      vars: {
                        fullnameuser: req.body.user.firstName,
                        email: req.body.user.email
                      }
                    });
                    return res.json({
                      success: 'Update Success',
                      error: false
                    })

                  }
                  else if (mail == 'withPass') {
                    mailer({
                      template: "updateUserWithPass",
                      footer: true,
                      to: req.body.user.email,
                      subject: "Mise à jour de votre compte - Fertillia",
                      vars: {
                        fullnameuser: req.body.user.firstName,
                        password: req.body.user.password
                      }
                    });
                    return res.json({
                      success: 'Update Success',
                      error: false
                    })

                  }
                  return res.json({
                    success: 'Update Success',
                    error: false
                  })
                }
              })

            }
          });
        }
        else {
          return res.json({
            message: 'Mail already existe',
            error: true
          })
        }

      }
      else {
        user.findByIdAndUpdate(req.body.user_id, {
          $set: {
            'local.email': email
          }
        }, {
          new: true
        }, function(err, p) {
          if (err) {
            return res.json({
              error: true,
              message: err
            });
          }
          else
            admin.findByIdAndUpdate(req.params.id, {
              $set: parameters
            }, {
              new: true
            }, function(err, p) {
              if (err) {
                return res.json({
                  error: true,
                  message: err
                });
              }
              else {
                if (mail == 'withPassAndMail') {
                  mailer({
                    template: "updateUserWithPassAndMail",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName,
                      password: req.body.user.password,
                      email: req.body.user.email
                    }
                  });
                  return res.json({
                    success: 'Update Success',
                    error: false
                  })
                }
                else if (mail == 'withMail') {
                  mailer({
                    template: "updateUserWithMail",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName,
                      email: req.body.user.email
                    }
                  });
                  return res.json({
                    success: 'Update Success',
                    error: false
                  })

                }
                else if (mail == 'withPass') {
                  mailer({
                    template: "updateUserWithPass",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName,
                      password: req.body.user.password
                    }
                  });
                  return res.json({
                    success: 'Update Success',
                    error: false
                  })

                }
                return res.json({
                  success: 'Update Success',
                  error: false
                })
              }
            })
        });

      }

    });
  }
}

module.exports.doctorUpdate = function(req, res) {
  var email = req.body.user.email;
  var parameters = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    phoneNumber: req.body.user.phoneNumber,
    position: req.body.user.position,
    email: req.body.user.email,
    profile_picture: req.body.user.profilePicture

  };
  if (!_jsy(email).isEmail()) {
    res.json({
      error: 'Mail  invalide'
    })
    return false
  }
  else {
    user.findOne({
      'local.email': email
    }, function(err, result) {
      // if there are any errors, return the error
      if (err)
        res.json(err)

      if (result) {
        // check to see if theres already a user with that email
        if (result.id == req.body.user_id) {

          user.findByIdAndUpdate(req.body.user_id, {
            $set: {
              'local.email': email

            }
          }, {
            new: true
          }, function(err, p) {
            if (err) {
              res.json({
                error: err
              });
            }
            else
              doctor.findByIdAndUpdate(req.params.id, {
                $set: parameters
              }, {
                new: true
              }, function(err, p) {
                if (err) {
                  res.json({
                    error: err
                  });
                }
                else {
                  mailer({
                    template: "welcomeUser",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName
                    }
                  });
                  res.json({
                    success: 'Update Success'
                  })
                  return false
                }
              })
          });

        }
        else {
          res.json({
            error: 'Mail already existe'
          })
          return false
        }
      }
      else {
        user.findByIdAndUpdate(req.body.user_id, {
          $set: {
            'local.email': email
          }
        }, {
          new: true
        }, function(err, p) {
          if (err) {
            res.json({
              error: err
            });
          }
          else
            doctor.findByIdAndUpdate(req.params.id, {
              $set: parameters
            }, {
              new: true
            }, function(err, p) {
              if (err) {
                res.json({
                  error: err
                });
              }
              else {
                mailer({
                  template: "welcomeUser",
                  footer: true,
                  to: req.body.user.email,
                  subject: "Mise à jour de votre compte - Fertillia",
                  vars: {
                    fullnameuser: req.body.user.firstName
                  }
                });
                res.json({
                  success: 'Update Success'
                })
                return false
              }
            })
        });

      }

    });
  }
}

module.exports.nurseUpdate = function(req, res) {
  var email = req.body.user.email;
  var parameters = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    phoneNumber: req.body.user.phoneNumber,
    email: req.body.user.email,
    profile_picture: req.body.user.profilePicture
  };
  if (!_jsy(email).isEmail()) {
    res.json({
      error: 'Mail  invalide'
    })
    return false
  }
  else {
    user.findOne({
      'local.email': email
    }, function(err, result) {
      // if there are any errors, return the error
      if (err)
        res.json(err)

      if (result) {
        // check to see if theres already a user with that email
        if (result.id == req.body.user_id) {

          user.findByIdAndUpdate(req.body.user_id, {
            $set: {
              'local.email': email

            }
          }, {
            new: true
          }, function(err, p) {
            if (err) {
              console.log(err)
              res.json({
                error: err
              });
            }
            else
              nurse.findByIdAndUpdate(req.params.id, {
                $set: parameters
              }, {
                new: true
              }, function(err, p) {
                if (err) {
                  res.json({
                    error: err
                  });
                }
                else {
                  mailer({
                    template: "welcomeUser",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName
                    }
                  });
                  res.json({
                    success: 'Update Success'
                  })
                  return false
                }
              })
          });

        }
        else {
          res.json({
            error: 'Mail already existe'
          })
          return false
        }
      }
      else {
        user.findByIdAndUpdate(req.body.user_id, {
          $set: {
            'local.email': email
          }
        }, {
          new: true
        }, function(err, p) {
          if (err) {
            console.log(err)
            res.json({
              error: err
            });
          }
          else
            nurse.findByIdAndUpdate(req.params.id, {
              $set: parameters
            }, {
              new: true
            }, function(err, p) {
              if (err) {
                res.json({
                  error: err
                });
              }
              else {
                mailer({
                  template: "welcomeUser",
                  footer: true,
                  to: req.body.user.email,
                  subject: "Mise à jour de votre compte - Fertillia",
                  vars: {
                    fullnameuser: req.body.user.firstName
                  }
                });
                res.json({
                  success: 'Update Success'
                })
                return false
              }
            })
        });

      }

    });
  }
}

module.exports.patientUpdate = function(req, res) {
  var email = req.body.user.email;
  var parameters = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    phoneNumber: req.body.user.phoneNumber,
    gender: req.body.user.gender,
    city: req.body.user.city,
    birth: req.body.user.birth,
    email: req.body.user.email,
    profile_picture: req.body.user.profilePicture,
    location: req.body.user.location,
  };
  if (!_jsy(email).isEmail()) {
    res.json({
      error: 'Mail  invalide'
    })
    return false
  }
  else {
    user.findOne({
      'local.email': email
    }, function(err, result) {
      // if there are any errors, return the error
      if (err)
        res.json(err)

      if (result) {
        // check to see if theres already a user with that email
        if (result.id == req.body.user_id) {

          user.findByIdAndUpdate(req.body.user_id, {
            $set: {
              'local.email': email

            }
          }, {
            new: true
          }, function(err, p) {
            if (err) {
              console.log(err)
              res.json({
                error: err
              });
            }
            else
              patient.findByIdAndUpdate(req.params.id, {
                $set: parameters
              }, {
                new: true
              }, function(err, p) {
                if (err) {
                  res.json({
                    error: err
                  });
                }
                else {
                  mailer({
                    template: "welcomeUser",
                    footer: true,
                    to: req.body.user.email,
                    subject: "Mise à jour de votre compte - Fertillia",
                    vars: {
                      fullnameuser: req.body.user.firstName
                    }
                  });
                  res.json({
                    success: 'Update Success'
                  })
                  return false
                }
              })
          });

        }
        else {
          res.json({
            error: 'Mail already existe'
          })
          return false
        }
      }
      else {
        user.findByIdAndUpdate(req.body.user_id, {
          $set: {
            'local.email': email
          }
        }, {
          new: true
        }, function(err, p) {
          if (err) {
            console.log(err)
            res.json({
              error: err
            });
          }
          else
            patient.findByIdAndUpdate(req.params.id, {
              $set: parameters
            }, {
              new: true
            }, function(err, p) {
              if (err) {
                res.json({
                  error: err
                });
              }
              else {
                mailer({
                  template: "welcomeUser",
                  footer: true,
                  to: req.body.user.email,
                  subject: "Mise à jour de votre compte - Fertillia",
                  vars: {
                    fullnameuser: req.body.user.firstName
                  }
                });
                res.json({
                  success: 'Update Success'
                })
                return false
              }
            })
        });

      }

    });
  }
}

module.exports.adminDelete = function(req, res) {

  admin.findById(req.params.id, function(err, result) {
    user.findById(result.user_id, function(err, res) {
      res.remove();
      if (err) {
        res.json({
          error: err
        });
      }
      else {
        result.remove();

      }
    })
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

module.exports.doctorDelete = function(req, res) {

  doctor.findById(req.params.id, function(err, result) {
    user.findById(result.user_id, function(err, res) {
      res.remove();
      if (err) {
        res.json({
          error: err
        });
      }
      else {
        result.remove();

      }
    })
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

module.exports.nurseDelete = function(req, res) {

  nurse.findById(req.params.id, function(err, result) {
    user.findById(result.user_id, function(err, res) {
      res.remove();
      if (err) {
        res.json({
          error: err
        });
      }
      else {
        result.remove();

      }
    })
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

module.exports.patientDelete = function(req, res) {

  patient.findById(req.params.id, function(err, result) {
    user.findById(result.user_id, function(err, res) {
      res.remove();
      if (err) {
        res.json({
          error: err
        });
      }
      else {
        result.remove();

      }
    })
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

module.exports.savecalendar = function(req, res) {
  console.log('req.body.events')
    // console.log(req.body.events)
  var eventsCalendar = []
  if (req.user) {
    async.series([
      function(next) {
        // for (var i = 0; i < req.body.events.length; i++) {
        //   var obj = {};
        //   obj.id = req.body.events[i].id;
        //   obj.title = req.body.events[i].title;
        //   obj.type = req.body.events[i].type;
        //   obj.start = new Date(req.body.events[i].start);
        //   obj.end = new Date(req.body.events[i].end);
        //   obj.allDay = req.body.events[i].allDay;
        //   obj.className = req.body.events[i].className;
        //   obj.stick = req.body.events[i].stick;
        //   obj.uid = req.body.events[i].uid;
        //   obj.affected = req.body.events[i].affected;
        //   obj.doctor = req.body.events[i].doctor;
        //   if (req.body.events[i].start_consultation) {
        //     obj.start_consultation = new Date(req.body.events[i].start_consultation);
        //   }

        //   // console.log(req.body.events[i]._id)

        //   eventsCalendar.push(obj)
        // }
        next();
      },
      function(next) {
        calendar.findOne({
          _id: req.body.idcalendar
        }, function(err, data) {
          console.log('------------data')
          console.log(data)
          if (err) {
            return res.json({
              error: true
            })
          }
          else
          if (!data) {
            //new calendar
            console.log("new calendar------------")
            calendar.create({
              events: req.body.events,
              update_at: new Date(),
              update_by: req.user._id,
              token: uuid.v4(),
            }, function(err, events) {
              if (err) {
                return res.json({
                  error: true
                })
              }
              else {
                return res.json({
                  error: false,
                  events: events
                })
              }
            });
          }
          else if (data) {

            if (((req.body.token) && (data.token == req.body.token)) || (req.body.push == true)) {
              // console.log('data')
              // console.log(data)
              console.log("update calendar")
              data.events = req.body.events;
              data.update_at = new Date();
              data.update_by = req.user._id;
              data.token = uuid.v4();

              // console.log('new data')
              // console.log(data)

              data.save(function(err, newdata) {
                {
                  if (err) {
                    return res.json({
                      error: true
                    })
                  }
                  else {
                    console.log('newdata.token')
                    console.log(newdata.token)
                    return res.json({
                      error: false,
                      events: newdata,
                      saved: true
                    })
                  }
                }
              })
            }
            else if ((data.token != req.body.token) && (req.body.push == false)) {
              console.log('data.token')
              console.log(data.token)
              console.log('req.body.token')
              console.log(req.body.token)
              console.log(data.token == req.body.token)
              return res.json({
                error: false,
                saved: false
              })

            }
            else if (!req.body.token) {
              return res.json({
                error: true
              })
            }

          }

        })
      }
    ]);

  }
  else
    return res.json({
      error: true
    })

};

module.exports.getcalendar = function(req, res) {
  if (req.user) {
    calendar.find({}, function(err, data) {
      if (err) {
        return res.json({
          error: true
        })
      }
      else {
        return res.json({
          error: false,
          events: data
        })
      }

    })
  }
  else
    return res.json({
      error: true
    })


};

// route middleware to ensure user is logged in
module.exports.isLoggedIn = function(req, res, next) {


  if (req.isAuthenticated())
    return next();

  res.redirect('/');



};


module.exports.isNotLoggedIn = function(req, res, next) {


  if (!req.isAuthenticated())
    return next();

  res.redirect('/');



};

module.exports.isLoggedIn2 = function(req, res, next) {
  console.log(req.isAuthenticated())
  console.log(req)
  if (req.isAuthenticated())
    res.json({
      code: 00,
      error: 'You are logged in.'
    });
  else {
    res.json({
      code: 80,
      error: 'You must logged in.'
    });
  }
}


module.exports.isAdmin = function(req, res, next) {


  if (req.user.local.typeuser == 1)
    return next();

  // res.redirect('/404');
  res.status(404).render('views/404.ejs');



};

module.exports.isNotAdmin = function(req, res, next) {
  
console.log(req.user)
  if (req.user && req.user.local.typeuser == 4)
    res.redirect('/404');
  else
    return next();
  // res.redirect('/404');
};





module.exports.removeFile = function(req, res) {
  if ((req.user) && (req.params.userid) && (req.body.file)) {
    var user_id = req.params.userid;
    patient.findOne({
      user_id: user_id
    }).exec(function(err, _patient) {
      if (err) {
        return res.json({
          error: true
        })
      }
      else {

        for (var i = 0; i < _patient.files.length; i++) {

          if (_patient.files[i] == req.body.file) {


            var index = _patient.files.indexOf(req.body.file);

            if (index > -1) {
              _patient.files.splice(index, 1);

              _patient.save(function(err2, newdata) {
                if (err2) {
                  return res.json({
                    error: true
                  })
                }
                else {

                  var filename = "uploads/" + user_id + "/" + req.body.file;

                  var tempFile = fs.openSync(filename, 'r');

                  fs.unlink(filename, function(err) {
                    if (err) {
                      return res.json({
                        error: true
                      })
                    }
                    else {
                      return res.json({
                        error: false
                      })
                    }
                  })
                }

              });




            }
            else
              return res.json({
                error: true
              })





          }






        }
      }
    });



  }
  else
    return res.json({
      error: true
    })

}
module.exports.uploadFiles = function(req, res) {


  if ((req.user) && (req.params.userid)) {


    var user_id = req.params.userid;

    patient.findOne({
      user_id: user_id
    }).exec(function(err, _patient) {
      if (err) {
        return res.json({
          error: true
        })
      }
      else {
        var files = []
        var form = new formidable.IncomingForm();

        form.multiples = true;

        form.uploadDir = path.join(__dirname, '../../uploads/' + user_id);

        if (!fs.existsSync(form.uploadDir)) {
          fs.mkdirSync(form.uploadDir);
        }


        form.on('file', function(field, file) {
          console.log('file');
          // file.name = uuid.v4() + "__name:" + file.name
          files.push(file.name);
          fs.rename(file.path, path.join(form.uploadDir, file.name));

        });

        form.on('error', function(err) {

          console.log('An error has occured: \n' + err);

          return res.json({
            error: true
          })

        });
        form.on('end', function() {
          console.log('end')
          console.log(files);
          for (var i = 0; i < files.length; i++) {
            _patient.files.push(files[i]);
          }

          // console.log(_patient.files = []);
          _patient.save(function(err2, newdata) {
            if (err2) {
              return res.json({
                error: true
              })
            }
            else
              return res.json({
                files: files,
                error: false
              })
          });

        });

        form.parse(req);
      }
    })
  }
  else
    return res.json({
      error: true
    })





};



module.exports.sendEmail = function(req, res) {

  mailer({
    template: "fertilliaContact",
    footer: true,
    to: "mahdi.hannachi@esprit.tn",
    subject: req.body.email.name + " - Fertillia",
    vars: {
      contact: req.body.email.name,
      email: req.body.email.adress,
      message: req.body.email.message
    }
  });
  return res.json({
    error: true
  })

}

module.exports.create_rdvDemand = function(req, res) {
  var r = new rdvDemand();

  r.date = req.body.rdvDemand.date;
  r.message = req.body.rdvDemand.message;
  r.type = req.body.rdvDemand.type;
  r.user = req.body.rdvDemand.user_id;
  r.etat = '1';

  r.save(function(err, bl) {
    if (err) {
      res.json({
        error: err
      });
    }
    else {

      mailer({
        template: "rdvDemandeSent",
        footer: true,
        to: req.user.local.email,
        subject: "Demande de rendez-vous - Fertillia",
        vars: {
          date: req.body.rdvDemand.date,
          message: req.body.rdvDemand.message,
          email: req.user.local.email
        }
      });
      console.log(r)
      res.json({
        success: true,
        response: 200,
        message: 'rdvDemand created'
      })
    }
  });
}

module.exports.get_rdvDemands = function(req, res, next) {
  rdvDemand.find().sort('-date').exec(function(err, rdvDemand) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json({
        rdvDemand
      });
    }
  });
};


module.exports.deleteRdvDemand = function(req, res) {
  rdvDemand.findById(req.params.id, function(err, rdv) {
    rdv.remove();
    if (err) {
      res.json({
        error: err
      });
    }
    else {
      res.json({
        success: true,
        response: 200,
        message: 'demand deleted'
      })
    }
  })
};


module.exports.deleteSelectedRdvDemand = function(req, res) {
  for (key in req.body.rdvDemands) {
    checkForValue(key, req.body.rdvDemands[key]);
  }

  function checkForValue(key, value) {

    if (value == true) {
      rdvDemand.findOne({
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

module.exports.updateRdvDemand = function(req, res) {

  rdvDemand.findByIdAndUpdate(req.params.id, {
    $set: {
      etat: req.body.etat
    }
  }, {
    new: true
  }, function(err, p) {
    if (err)
      res.json({
        error: err
      });

    else {
      if (req.body.etat == '2') {
        mailer({
          template: "rdvDemandeAccept",
          footer: true,
          to: req.body.rdvDemand.user.email,
          subject: "Réponse de rendez-vous - Fertillia",
          vars: {
            date: p.date,
            message: p.message,
            email: req.user.local.email
          }
        });
      }
      else if (req.body.etat == '3') {
        mailer({
          template: "rdvDemandeRefuse",
          footer: true,
          to: req.body.rdvDemand.user.email,
          subject: "Réponse de rendez-vous - Fertillia",
          vars: {
            date: p.date,
            message: p.message,
            email: req.user.local.email
          }
        });
      }
      res.json(p);
    }


  });

};
