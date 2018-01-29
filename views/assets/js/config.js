materialAdmin
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/dashboard");

        $stateProvider
        //------------------------------
        // dashboard
        //------------------------------

            .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'dashboard',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'css',
                        insertBefore: '#app-level',
                        files: [
                            '/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                            '/css/chartjs-visualizations.css'
                        ]
                    }, {
                        name: 'vendors',
                        files: [
                            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js',
                            'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js',
                            '/vendors/bower_components/moment/min/moment.min.js',
                            '/vendors/bower_components/fullcalendar/dist/fullcalendar.min.js',
                            '/vendors/bower_components/fullcalendar/dist/lang-all.js',
                            '/js/view-selector2.js',
                            '/js/date-range-selector.js',
                            '/js/active-users.js',
                           

                        ]
                    }])
                }
            }
        })

        //------------------------------
        // CALENDAR
        //------------------------------

        .state('calendar', {
            url: '/calendar',
            templateUrl: 'calendar',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'css',
                        insertBefore: '#app-level',
                        files: [
                            'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                        ]
                    }, {
                        name: 'vendors',
                        files: [
                            'vendors/bower_components/moment/min/moment.min.js',
                            'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js',
                            '/vendors/bower_components/fullcalendar/dist/lang-all.js'
                        ]
                    }])
                }
            }
        })

        //------------------------------
        // NEWS
        //------------------------------
        .state('messages', {
            url: '/messages',
            templateUrl: 'messages'
        })

        .state('singleChat', {
            url: '/single-chat',
            templateUrl: 'single-chat'
        })

        .state('newChat', {
            url: '/new-chat',
            templateUrl: 'new-chat'
        })
        .state('messagesHistory', {
            url: '/messagesHistory',
            templateUrl: 'messagesHistory'
        })
        .state('single-chat-history', {
            url: '/single-chat-history',
            templateUrl: 'single-chat-history'
        })

        //------------------------------
        // NEWS
        //------------------------------
        .state('news', {
            url: '/news',
            templateUrl: 'articles'
        })

        .state('news.article', {
            url: '/articles',
            templateUrl: 'articles'
        })

        .state('new-article', {
            url: '/news/new-article',
            templateUrl: 'new-article'
        })

        .state('update-article', {
            url: '/news/update-article',
            templateUrl: 'update-article'
        })


        //------------------------------
        // Users
        //------------------------------
        .state('users', {
            url: '/users',
            templateUrl: 'all-users'
        })

        // List
        .state('admins', {
            url: '/users/admins',
            templateUrl: 'admins'
        })

        .state('doctors', {
            url: '/users/doctors',
            templateUrl: 'doctors'
        })

        .state('nurses', {
            url: '/users/nurses',
            templateUrl: 'nurses'
        })

        .state('patients', {
            url: '/users/patients',
            templateUrl: 'patients'
        })


        // create
        .state('new-user', {
            url: '/users/new-user',
            templateUrl: 'new-user'
        })

        .state('new-doctor', {
            url: '/users/new-doctor',
            templateUrl: 'new-doctor'
        })

        .state('new-patient', {
            url: '/users/new-patient',
            templateUrl: 'new-patient'
        })

        .state('new-admin', {
            url: '/users/new-admin',
            templateUrl: 'new-admin'
        })

        .state('new-nurse', {
            url: '/users/new-nurse',
            templateUrl: 'new-nurse'
        })


        // View profile
        .state('profile-doctor', {
            url: '/profile-doctor',
            templateUrl: 'profile-doctor',
            params: {
                id: null
            },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'css',
                        insertBefore: '#app-level',
                        files: [
                            'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                        ]
                    }, {
                        name: 'vendors',
                        files: [
                            'vendors/bower_components/moment/min/moment.min.js',
                            'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js'
                        ]
                    }])
                }
            }
        })

        .state('profile-patient', {
            url: '/profile-patient',
            templateUrl: 'profile-patient',
            params: {
                id: null
            }
        })

        .state('profile-nurse', {
                url: '/profile-nurse',
                templateUrl: 'profile-nurse',
                params: {
                    id: null
                }
            })
            .state('profile-admin', {
                url: '/profile-admin',
                templateUrl: 'profile-admin',
                params: {
                    id: null
                }
            })
            .state('update-admin', {
                url: '/update-admin',
                templateUrl: 'update-admin',
                params: {
                    id: null
                }
            })
            .state('update-doctor', {
                url: '/update-doctor',
                templateUrl: 'update-doctor',
                params: {
                    id: null
                }
            })
            .state('update-nurse', {
                url: '/update-nurse',
                templateUrl: 'update-nurse',
                params: {
                    id: null
                }
            })
            .state('update-patient', {
                url: '/update-patient',
                templateUrl: 'update-patient',
                params: {
                    id: null
                }
            })
            .state('update-user', {
                url: '/update-user',
                templateUrl: 'update-user',
                params: {
                    id: null
                }
            })
            .state('rdv-demands', {
                url: '/rdv-demands',
                templateUrl: 'rdv-demands',
                params: {
                    id: null
                }
            }).state('stats', {
                url: '/stats',
                templateUrl: 'stats',
                params: {
                    id: null
                },
                resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'css',
                        insertBefore: '#app-level',
                        files: [
                            '/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                            '/css/chartjs-visualizations.css'
                        ]
                    }, {
                        name: 'vendors',
                        files: [
                            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js',
                            'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js',
                            '/vendors/bower_components/moment/min/moment.min.js',
                            '/vendors/bower_components/fullcalendar/dist/fullcalendar.min.js',
                            '/vendors/bower_components/fullcalendar/dist/lang-all.js',
                            '/js/view-selector2.js',
                            '/js/date-range-selector.js',
                            '/js/active-users.js',
                           

                        ]
                    }])
                }
            }
            })

    })

.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigBlue', {
        color: 'black',
        radius: 15
    });
    usSpinnerConfigProvider.setTheme('small', {
        color: 'black',
        radius: 6
    });
}])

.animation('.fades', function() {
    return {
        enter: function(element, done) {
            element.css('display', 'none');
            $(element).fadeIn(0, function() {
                done();
            });
        },
        leave: function(element, done) {
            $(element).fadeOut(0, function() {
                done();
            });
        },
        move: function(element, done) {
            element.css('display', 'none');
            $(element).slideDown(0, function() {
                done();
            });
        }
    }
})
