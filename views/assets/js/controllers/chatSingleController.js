// chatController contoller 
materialAdmin.controller('chatSingleController', function($location, $sce, $uibModal, $timeout, $scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, Socket, usSpinnerService) {

    //to test if we are in the single chat view
    $rootScope.inChat = true;


    //socket for receiving new message
    Socket.on('hello', function(data) {
        console.log(data)
    })

    Socket.on('newMessage', function(data) {
        if ($location.path() == '/single-chat') {
            if (data.to == $sessionStorage.connectedUser.user_id && data.from == $scope.discussion.correspondant.user_id) {
                $scope.$emit('customEvent');
                if (data.from == $scope.discussion.correspondant.user_id) {
                    data.fromUser = $scope.discussion.correspondant;
                    data.messageClass = 'lv-item media';
                    data.user_avatar = 'lv-avatar pull-left'
                }
                else {
                    data.fromUser = $scope.connectedUser;
                    data.messageClass = 'lv-item media right';
                    data.user_avatar = 'lv-avatar pull-right'
                }
                $scope.discussion.messages.push(data);
                $scope.playAudio()
                $timeout(function() {
                    var scroller = document.getElementById("div1");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
            }
            else if (data.to == $sessionStorage.connectedUser.user_id) {
                $scope.$emit('customEvent');
            }
        }
    });

    //function to play sound (used in socket)
    $scope.playAudio = function() {
        var audio = new Audio('audio/notification.mp3');
        audio.play();
    };

    // function to stop the spinner after data loads
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-chat');
    }

    //init the controller
    $rootScope.initSingleChat = function() {
        $scope.correspondant;
        $scope.connectedUser = $sessionStorage.connectedUser;
        $http.get('/chat/discussion/' + $sessionStorage.discussion.id).success(function(response) {
            $scope.discussion = response.data;
            $http.post('/chat/seenOnMessages', {
                messages: $scope.discussion.messages,
                messagesTo: $sessionStorage.connectedUser
            }).success(function(response) {
                //$scope.$emit('customEvent');
                $scope.discussion.messages.forEach(function(message) {
                    if (message.from == $scope.discussion.correspondant.user_id) {
                        message.fromUser = $scope.discussion.correspondant;
                        message.messageClass = 'lv-item media fades';
                        message.user_avatar = 'lv-avatar pull-left'
                    }
                    else {
                        message.fromUser = $scope.connectedUser;
                        message.messageClass = 'lv-item media right fades';
                        message.user_avatar = 'lv-avatar pull-right'
                    }
                })

                $scope.chatDiscussion = $scope.discussion;
                $scope.data = $scope.discussion.messages.slice(0, 5);


                $scope.stopSpin()
                $timeout(function() {
                    var scroller = document.getElementById("div1");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);

            }).error(function(response) {
                $scope.error = response.message;
            });
        }).error(function(response) {
            $scope.error = response.message;
        });

    }

    $rootScope.initSingleChat();


    //redirection to new chat
    $scope.newChat = function(user_id) {
        $http.post('/chat/new/', {
            connectedUser: $sessionStorage.connectedUser,
            correspondant_id: user_id
        }).success(function(response) {
            $state.go('newChat')

        }).error(function(response) {
            $scope.error = response.message;
        });
    }


    $scope.enterPress = function(keyEvent) {
            if (keyEvent.which === 13)
                $scope.sendMessage();
        }
        //send message 
    $scope.sendMessage = function() {
        if ($scope.messageText != '') {
            var correspondantId;
            var discussion = $sessionStorage.discussion;
            discussion.users.forEach(function(user) {
                if (user._id != $sessionStorage.connectedUser.user_id)
                    correspondantId = user._id;
            })
            $http.post('/chat/sendMessage/', {
                discussionId: discussion.id,
                correspondant_id: correspondantId,
                message: $scope.messageText
            }).success(function(response) {
                console.log(response)
                $scope.glued = true;
                Socket.emit('newMessage', response.message);
                $scope.checkSeen()
                if (response.message.from == $scope.discussion.correspondant.user_id) {
                    response.message.fromUser = $scope.discussion.correspondant;
                    response.message.messageClass = 'lv-item media fades';
                    response.message.user_avatar = 'lv-avatar pull-left'
                }
                else {
                    response.message.fromUser = $scope.connectedUser;
                    response.message.messageClass = 'lv-item media right fades';
                    response.message.user_avatar = 'lv-avatar pull-right'
                }
                $scope.discussion.messages.push(response.message);
                $timeout(function() {
                    var scroller = document.getElementById("div1");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
                $scope.messageText = '';
                $scope.$emit('customEvent');
            }).error(function(response) {
                $scope.error = response.message;
            });
        }
    }

    //seen on messages that are sent to me, called after every sendMessage
    $scope.checkSeen = function() {
        $http.post('/chat/seenOnMessages', {
            messages: $scope.discussion.messages,
            messagesTo: $sessionStorage.connectedUser
        }).success(function(response) {}).error(function(response) {
            $scope.error = response.message;
        });

    }

    //delete the conversation im in
    $scope.deleteModal = function(id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            templateUrl: 'myModalContent.html',
            backdrop: 'static',
            controller: function($uibModalInstance, $scope, $rootScope) {
                $scope.ok = function() {
                    $http.post("chat/delete/" + id)
                        .success(function() {
                            // $state.reload();
                            uibModalInstance.dismiss();
                            $sessionStorage.discussion = null;
                            $state.go('messages')
                            growlService.growl('Conversation deleted ', 'inverse');
                        })
                        .error(function() {

                        });
                };
                $scope.cancel = function() {};

            },
            size: 'sm'
        });
    }

    $("textarea").keydown(function(e) {
        // Enter was pressed without shift key
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            $scope.sendMessage();
        }
    });


})
