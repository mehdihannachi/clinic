materialAdmin
// =========================================================================
// Base controller for common functions
// =========================================================================

    .controller('materialadminCtrl', function($location, $timeout, $state, $scope, growlService, $sessionStorage, Socket, $rootScope, $http, $window) {
      
      this.btn_test = function() {
        $http.get('/isLoggedIn2').success(function(response) {
            console.log(response)
            if (response.error == false) {

            }
            else {
                $scope.error = true;
                $scope.errorMSG = response.error;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }

        }).error(function(res2) {});
    }
      
        if(usertype)
        $scope.usertype = usertype;
    
    $rootScope.$on('$stateChangeSuccess', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    $sessionStorage.connectedUser = user;
    $rootScope.inChat = false
        //Welcome Message
    var welcomeMessage = 'Bienvenu ' + user.firstName + ' ' + user.lastName + ' !';

    growlService.growl(welcomeMessage, 'inverse')

    Socket.on('newMessage', function(data) {
        if ($location.path() != '/single-chat') {
            if (data.to == $sessionStorage.connectedUser.user_id) {
                $scope.$emit('customEvent');

                $http.get('/chat/discussion/' + data.discussion).success(function(response) {
                    $scope.discussion = response.data;
                    $scope.discussion.users.forEach(function(user) {
                        if (user._id != $sessionStorage.connectedUser.user_id) {
                            if (user.local.typeuser == 1) {
                                URL = '/user/admin/';
                            }
                            else if (user.local.typeuser == 2) {
                                URL = '/user/nurse/';
                            }
                            else if (user.local.typeuser == 3) {
                                URL = '/user/doctor/';
                            }
                            else if (user.local.typeuser == 4) {
                                URL = '/user/patient/';
                            }
                            $http.get(URL + user._id).success(function(response) {

                                if (response) {
                                    if (response.error) {
                                        $scope.error = true;
                                        $scope.errorMSG = response.error
                                    }
                                    else {


                                        $scope.correspondant = response
                                        $scope.playAudio()
                                        if (!('Notification' in window)) {
                                            console.log('Web Notification not supported');
                                            return;
                                        }

                                        /*  Notification.requestPermission(function(permission) {
                                    var notification = new Notification("Title", {
                                        body: 'HTML5 Web Notification API',
                                        icon: 'http://i.stack.imgur.com/Jzjhz.png?s=48&g=1',
                                        dir: 'auto'
                                    });
                                    setTimeout(function() {
                                        notification.close();
                                    }, 3000);
                                });
*/
                                        var notification = $scope.correspondant.firstName + ' ' + $scope.correspondant.lastName + ' vous a envoyé un nouveau message'
                                        notifyMe(notification, $scope.correspondant)
                                        growlService.growl(notification, 'inverse');
                                    }
                                }
                            }).error(function(err) {
                                console.error(err)
                            });
                        }

                    })



                }).error(function(response) {
                    $scope.error = response.message;
                });


            }

            function notifyMe(message, correspondant) {
                if (!("Notification" in window)) {
                    alert("This browser does not support desktop notification");
                }
                else if (Notification.permission === "granted") {
                    var options = {
                        body: message,
                        icon: correspondant.profile_picture,
                        dir: "ltr"
                    };
                    var notification = new Notification("Vous avez reçu un nouveau message", options);
                }
                else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function(permission) {
                        if (!('permission' in Notification)) {
                            Notification.permission = permission;
                        }

                        if (permission === "granted") {
                            var options = {
                                body: message,
                                icon: correspondant.profile_picture,
                                dir: "ltr"
                            };
                            var notification = new Notification("Vous avez reçu un nouveau message", options);
                        }
                    });
                }
            }
        }
    })


    /*$scope.$window = $window;

    $scope.$window.onclick = function(event) {

        $timeout(function() {
            angular.element('#closeDialog').triggerHandler('click');
        });

    }*/

    $scope.playAudio = function() {
        var audio = new Audio('audio/notification.mp3');
        audio.play();
    };
    // Detact Mobile Browser
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        angular.element('html').addClass('ismobile');
    }

    // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
    this.sidebarToggle = {
        left: false,
        right: false
    }

    // By default template has a boxed layout
    this.layoutType = localStorage.getItem('ma-layout-status');

    // For Mainmenu Active Class
    this.$state = $state;


    //Close sidebar on click
    this.sidebarStat = function(event) {
        if (!angular.element(event.target).parent().hasClass('active')) {
            this.sidebarToggle.left = false;
        }
    }




    //Listview menu toggle in small screens
    this.lvMenuStat = false;

    //Blog
    this.wallCommenting = [];

    this.wallImage = false;
    this.wallVideo = false;
    this.wallLink = false;

    //Skin Switch
    this.currentSkin = 'blue';

    this.skinList = [
        'lightblue',
        'bluegray',
        'cyan',
        'teal',
        'green',
        'orange',
        'blue',
        'purple'
    ]

    this.skinSwitch = function(color) {
        this.currentSkin = color;
    }

})


// =========================================================================
// Header
// =========================================================================
.controller('headerCtrl', function($timeout, messageService) {

    // Top Search
    this.openSearch = function() {
        angular.element('#header').addClass('search-toggled');
        angular.element('#top-search-wrap').find('input').focus();
    }

    this.closeSearch = function() {
        angular.element('#header').removeClass('search-toggled');
    }

    // Get messages and notification for header
    this.img = messageService.img;
    this.user = messageService.user;
    this.user = messageService.text;

    this.messageResult = messageService.getMessage(this.img, this.user, this.text);


    //Clear Notification
    this.clearNotification = function($event) {
        $event.preventDefault();

        var x = angular.element($event.target).closest('.listview');
        var y = x.find('.lv-item');
        var z = y.size();

        angular.element($event.target).parent().fadeOut();

        x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
        x.find('.grid-loading').fadeIn(1500);
        var w = 0;

        y.each(function() {
            var z = $(this);
            $timeout(function() {
                z.addClass('animated fadeOutRightBig').delay(1000).queue(function() {
                    z.remove();
                });
            }, w += 150);
        })

        $timeout(function() {
            angular.element('#notifications').addClass('empty');
        }, (z * 150) + 200);
    }

    // Clear Local Storage
    this.clearLocalStorage = function() {

        //Get confirmation, if confirmed clear the localStorage
        swal({
            title: "Are you sure?",
            text: "All your saved localStorage values will be removed",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F44336",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {
            localStorage.clear();
            swal("Done!", "localStorage is cleared", "success");
        });

    }

    //Fullscreen View
    this.fullScreen = function() {
        //Launch
        function launchIntoFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
            else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
            else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
            else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }

        //Exit
        function exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }

        if (exitFullscreen()) {
            launchIntoFullscreen(document.documentElement);
        }
        else {
            launchIntoFullscreen(document.documentElement);
        }
    }

})



// =========================================================================
// Best Selling Widget
// =========================================================================

.controller('bestsellingCtrl', function(bestsellingService) {
    // Get Best Selling widget Data
    this.img = bestsellingService.img;
    this.name = bestsellingService.name;
    this.range = bestsellingService.range;

    this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
})


// =========================================================================
// Todo List Widget
// =========================================================================

.controller('todoCtrl', function(todoService) {
    //Get Todo List Widget Data
    this.todo = todoService.todo;

    this.tdResult = todoService.getTodo(this.todo);

    //Add new Item (closed by default)
    this.addTodoStat = false;
})


// =========================================================================
// Recent Items Widget
// =========================================================================

.controller('recentitemCtrl', function(recentitemService) {
    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;

    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
})


// =========================================================================
// Recent Posts Widget
// =========================================================================

.controller('recentpostCtrl', function(recentpostService) {
    //Get Recent Posts Widget Items
    this.img = recentpostService.img;
    this.user = recentpostService.user;
    this.text = recentpostService.text;

    this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
})


//=================================================
// Profile
//=================================================

.controller('profileCtrl', function(growlService) {

    //Get Profile Information from profileService Service

    //User
    this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

    this.fullName = "Mallinda Hollaway";
    this.gender = "female";
    this.birthDay = "23/06/1988";
    this.martialStatus = "Single";
    this.mobileNumber = "00971123456789";
    this.emailAddress = "malinda.h@gmail.com";
    this.twitter = "@malinda";
    this.twitterUrl = "twitter.com/malinda";
    this.skype = "malinda.hollaway";
    this.addressSuite = "44-46 Morningside Road";
    this.addressCity = "Edinburgh";
    this.addressCountry = "Scotland";

    //Edit
    this.editSummary = 0;
    this.editInfo = 0;
    this.editContact = 0;


    this.submit = function(item, message) {
        if (item === 'profileSummary') {
            this.editSummary = 0;
        }

        if (item === 'profileInfo') {
            this.editInfo = 0;
        }

        if (item === 'profileContact') {
            this.editContact = 0;
        }

        growlService.growl(message + ' has updated Successfully!', 'inverse');
    }

})



//=================================================
// LOGIN
//=================================================

.controller('loginCtrl', function() {
    //Status

    this.login = 1;
    this.register = 0;
    this.forgot = 0;
})


//=================================================
// DIALOG
//=================================================

.controller('dialogCtrl', function($scope, $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    };

    $scope.reminderModal = function(ev) {
        $mdDialog.show({
            templateUrl: 'views/modal-reminder.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    $scope.uppoinmentModal = function(ev) {
        $mdDialog.show({
            templateUrl: 'views/modal-uppoinment.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };
})

//=================================================
// CALENDAR
//=================================================

.controller('calendarCtrl', function($uibModal) {

    //Create and add Action button with dropdown in Calendar header. 
    this.month = 'month';

    this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
        '<li class="uib-dropdown" uib-dropdown>' +
        '<a href="" uib-dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
        '<ul class="uib-dropdown-menu dropdown-menu-right">' +
        '<li class="active">' +
        '<a data-calendar-view="month" href="">Month View</a>' +
        '</li>' +
        '<li>' +
        '<a data-calendar-view="basicWeek" href="">Week View</a>' +
        '</li>' +
        '<li>' +
        '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
        '</li>' +
        '<li>' +
        '<a data-calendar-view="basicDay" href="">Day View</a>' +
        '</li>' +
        '<li>' +
        '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</li>';


    //Open new event modal on selecting a day
    this.onSelect = function(argStart, argEnd) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addEvent.ejs',
            controller: 'addeventCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                calendarData: function() {
                    var x = [argStart, argEnd];
                    return x;
                }
            }
        });
    }
})

//Add event Controller (Modal Instance)
.controller('addeventCtrl', function($scope, $uibModalInstance, calendarData) {
    //Calendar Event Data
    $scope.calendarData = {
        eventStartDate: calendarData[0],
        eventEndDate: calendarData[1]
    };

    //Tags
    $scope.tags = [
        'bgm-teal',
        'bgm-red',
        'bgm-pink',
        'bgm-blue',
        'bgm-lime',
        'bgm-green',
        'bgm-cyan',
        'bgm-orange',
        'bgm-purple',
        'bgm-gray',
        'bgm-black',
    ]

    //Select Tag
    $scope.currentTag = '';

    $scope.onTagClick = function(tag, $index) {
        $scope.activeState = $index;
        $scope.activeTagColor = tag;
    }

    //Add new event
    $scope.addEvent = function() {
        if ($scope.calendarData.eventName) {

            //Render Event
            $('#calendar').fullCalendar('renderEvent', {
                title: $scope.calendarData.eventName,
                start: $scope.calendarData.eventStartDate,
                end: $scope.calendarData.eventEndDate,
                allDay: true,
                className: $scope.activeTagColor,
                lang: 'fr'

            }, true); //Stick the event

            $scope.activeState = -1;
            $scope.calendarData.eventName = '';
            $uibModalInstance.close();
        }
    }

    //Dismiss 
    $scope.eventDismiss = function() {
        $uibModalInstance.dismiss();
    }
})

// =========================================================================
// COMMON FORMS
// =========================================================================

.controller('formCtrl', function() {
    //Input Slider
    this.nouisliderValue = 4;
    this.nouisliderFrom = 25;
    this.nouisliderTo = 80;
    this.nouisliderRed = 35;
    this.nouisliderBlue = 90;
    this.nouisliderCyan = 20;
    this.nouisliderAmber = 60;
    this.nouisliderGreen = 75;

    //Color Picker
    this.color = '#03A9F4';
    this.color2 = '#8BC34A';
    this.color3 = '#F44336';
    this.color4 = '#FFC107';
})


// =========================================================================
// PHOTO GALLERY
// =========================================================================

.controller('photoCtrl', function() {
    //Default grid size (2)
    this.photoColumn = 'col-md-2';
    this.photoColumnSize = 2;

    this.photoOptions = [{
        value: 2,
        column: 6
    }, {
        value: 3,
        column: 4
    }, {
        value: 4,
        column: 3
    }, {
        value: 1,
        column: 12
    }, ]

    //Change grid
    this.photoGrid = function(size) {
        this.photoColumn = 'col-md-' + size;
        this.photoColumnSize = size;
    }

})


// =========================================================================
// ANIMATIONS DEMO
// =========================================================================
.controller('animCtrl', function($timeout) {
    //Animation List
    this.attentionSeekers = [{
        animation: 'bounce',
        target: 'attentionSeeker'
    }, {
        animation: 'flash',
        target: 'attentionSeeker'
    }, {
        animation: 'pulse',
        target: 'attentionSeeker'
    }, {
        animation: 'rubberBand',
        target: 'attentionSeeker'
    }, {
        animation: 'shake',
        target: 'attentionSeeker'
    }, {
        animation: 'swing',
        target: 'attentionSeeker'
    }, {
        animation: 'tada',
        target: 'attentionSeeker'
    }, {
        animation: 'wobble',
        target: 'attentionSeeker'
    }]
    this.flippers = [{
        animation: 'flip',
        target: 'flippers'
    }, {
        animation: 'flipInX',
        target: 'flippers'
    }, {
        animation: 'flipInY',
        target: 'flippers'
    }, {
        animation: 'flipOutX',
        target: 'flippers'
    }, {
        animation: 'flipOutY',
        target: 'flippers'
    }]
    this.lightSpeed = [{
        animation: 'lightSpeedIn',
        target: 'lightSpeed'
    }, {
        animation: 'lightSpeedOut',
        target: 'lightSpeed'
    }]
    this.special = [{
        animation: 'hinge',
        target: 'special'
    }, {
        animation: 'rollIn',
        target: 'special'
    }, {
        animation: 'rollOut',
        target: 'special'
    }]
    this.bouncingEntrance = [{
        animation: 'bounceIn',
        target: 'bouncingEntrance'
    }, {
        animation: 'bounceInDown',
        target: 'bouncingEntrance'
    }, {
        animation: 'bounceInLeft',
        target: 'bouncingEntrance'
    }, {
        animation: 'bounceInRight',
        target: 'bouncingEntrance'
    }, {
        animation: 'bounceInUp',
        target: 'bouncingEntrance'
    }]
    this.bouncingExits = [{
        animation: 'bounceOut',
        target: 'bouncingExits'
    }, {
        animation: 'bounceOutDown',
        target: 'bouncingExits'
    }, {
        animation: 'bounceOutLeft',
        target: 'bouncingExits'
    }, {
        animation: 'bounceOutRight',
        target: 'bouncingExits'
    }, {
        animation: 'bounceOutUp',
        target: 'bouncingExits'
    }]
    this.rotatingEntrances = [{
        animation: 'rotateIn',
        target: 'rotatingEntrances'
    }, {
        animation: 'rotateInDownLeft',
        target: 'rotatingEntrances'
    }, {
        animation: 'rotateInDownRight',
        target: 'rotatingEntrances'
    }, {
        animation: 'rotateInUpLeft',
        target: 'rotatingEntrances'
    }, {
        animation: 'rotateInUpRight',
        target: 'rotatingEntrances'
    }]
    this.rotatingExits = [{
        animation: 'rotateOut',
        target: 'rotatingExits'
    }, {
        animation: 'rotateOutDownLeft',
        target: 'rotatingExits'
    }, {
        animation: 'rotateOutDownRight',
        target: 'rotatingExits'
    }, {
        animation: 'rotateOutUpLeft',
        target: 'rotatingExits'
    }, {
        animation: 'rotateOutUpRight',
        target: 'rotatingExits'
    }]
    this.fadeingEntrances = [{
        animation: 'fadeIn',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInDown',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInDownBig',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInLeft',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInLeftBig',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInRight',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInRightBig',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInUp',
        target: 'fadeingEntrances'
    }, {
        animation: 'fadeInBig',
        target: 'fadeingEntrances'
    }]
    this.fadeingExits = [{
        animation: 'fadeOut',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutDown',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutDownBig',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutLeft',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutLeftBig',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutRight',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutRightBig',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutUp',
        target: 'fadeingExits'
    }, {
        animation: 'fadeOutUpBig',
        target: 'fadeingExits'
    }]
    this.zoomEntrances = [{
        animation: 'zoomIn',
        target: 'zoomEntrances'
    }, {
        animation: 'zoomInDown',
        target: 'zoomEntrances'
    }, {
        animation: 'zoomInLeft',
        target: 'zoomEntrances'
    }, {
        animation: 'zoomInRight',
        target: 'zoomEntrances'
    }, {
        animation: 'zoomInUp',
        target: 'zoomEntrances'
    }]
    this.zoomExits = [{
        animation: 'zoomOut',
        target: 'zoomExits'
    }, {
        animation: 'zoomOutDown',
        target: 'zoomExits'
    }, {
        animation: 'zoomOutLeft',
        target: 'zoomExits'
    }, {
        animation: 'zoomOutRight',
        target: 'zoomExits'
    }, {
        animation: 'zoomOutUp',
        target: 'zoomExits'
    }]

    //Animate    
    this.ca = '';

    this.setAnimation = function(animation, target) {
        if (animation === "hinge") {
            animationDuration = 2100;
        }
        else {
            animationDuration = 1200;
        }

        angular.element('#' + target).addClass(animation);

        $timeout(function() {
            angular.element('#' + target).removeClass(animation);
        }, animationDuration);
    }
})
