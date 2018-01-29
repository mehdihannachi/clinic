// userController contoller 


materialAdmin.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});

materialAdmin.filter('ageFilter', function() {
    return function(birthday) {
        var birthday = new Date(birthday);
        var today = new Date();
        var age = ((today - birthday) / (31557600000));
        var age = Math.floor(age);
        return age;
    }
});


materialAdmin.filter('filtre_fileName', function() {
    return function(input) {
        return input.split('__name:').pop()
    };
})

materialAdmin.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

materialAdmin.controller('userController', function($scope, $http, $resource, $window, $state, $sessionStorage, uuid, $uibModal, $rootScope, usSpinnerService, growlService) {


    var typeuser = $sessionStorage.typeuser;
    var user_id = $sessionStorage.userProfile
    var URL;
    $scope.user;

    /* Calendar config object */
    $scope.uiConfig = {
        calendar_small: {
            editable: false,
            theme: true, //Do not remove this as it ruin the design
            selectable: true,
            selectHelper: true,
            scrollTime: '12:00:00',
            slotDuration: '00:20:00',
            snapDuration: '00:05:00',
            droppable: true, // this allows things to be dropped onto the calendar
            header: {
                left: '', // month basicWeek basicDay agendaWeek agendaDay
                center: 'prev, title, next',
                right: ''
            },
            eventClick: false,
            eventDrop: false,
            eventRender: $scope.eventRender,
            dayClick: false,
            drop: false
        }
    };

    $scope.profile_events = [];
    // type = 0 => doctor
    // type = 1 => patient

    $scope.getDoctor_calendar = function() {
        $http.get('/calender-get')
            .success(function(data) {
                console.log(data.events)


                if ((data.error == false) && (data.events.length != 0)) {
                    for (var i = 0; i < data.events[0].events.length; i++) {

                        if ((data.events[0].events[i].type == 1) && (data.events[0].events[i].affected == true)) {
                            // console.log(data.events[0].events[i].doctor)
                            if (data.events[0].events[i].doctor == user_id) {

                                // console.log("1")
                                data.events[0].events[i].start = new Date(data.events[0].events[i].start)
                                data.events[0].events[i].end = new Date(data.events[0].events[i].end)
                                $scope.profile_events.push(data.events[0].events[i])
                            }
                        }
                        if ((data.events[0].events[i].type == 0) && (data.events[0].events[i].id == user_id)) {

                            // console.log("1")
                            data.events[0].events[i].start = new Date(data.events[0].events[i].start)
                            data.events[0].events[i].end = new Date(data.events[0].events[i].end)
                            $scope.profile_events.push(data.events[0].events[i])

                        }
                    }
                    // console.log('$scope.profile_events')
                    // console.log($scope.profile_events)

                }
                else if (data.error == true) {
                    growlService.growl('There was an error processing your order. Please try again!', 'danger');
                }

            }).error(function(err) {
                growlService.growl('There was an error processing your order. Please try again!', 'danger');
            });
    }
    $scope.getDoctor_calendar();

    /* event sources array*/
    $scope.profile_eventSources = [$scope.profile_events];


    $scope.getPatient_appointments = function(user) {
        $scope.rendez_vous = [];
        $http.get('/calender-get')
            .success(function(response) {
                $scope.events = response.events;
                $scope.userName = $scope.user.firstName + ' ' + $scope.user.lastName;
                $scope.events[0].events.forEach(function(event) {


                    if (event.id == user.user_id) {
                        $http.get('/user/doctor/' + event.doctor).success(function(response) {
                            if (response) {
                                if (response.error) {
                                    $scope.error = true;
                                    $scope.errorMSG = response.error
                                }
                                else {
                                    event.doctorInfo = response;
                                    $scope.rendez_vous.push(event);
                                }
                            }

                        }).error(function(err) {
                            console.error(err)
                        });
                    }
                })
            }).error(function(err) {
                console.error(err)
            })
    }

    // console.log('user_id');
    // console.log(user_id);
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }
    $scope.initUser = function() {
        $scope.user_files = []
        if (typeuser == 1) {
            URL = '/user/admin/';
        }
        else if (typeuser == 2) {
            URL = '/user/nurse/';
        }
        else if (typeuser == 3) {
            URL = '/user/doctor/';
        }
        else if (typeuser == 4) {
            URL = '/user/patient/';
        }
        $http.get(URL + user_id).success(function(response) {

            if (response) {
                if (response.error) {
                    $scope.error = true;
                    $scope.errorMSG = response.error
                }
                $scope.stopSpin()
                console.log(response)
                $scope.user = response
                $sessionStorage.userProfile = $scope.user;
                $scope.getPatient_appointments($scope.user);
                console.log('$scope.user.files')
                console.log($scope.user.files)
                for (var i = 0; i < $scope.user.files.length; i++) {
                    var obj = {}
                    obj.name = $scope.user.files[i]
                    $scope.user_files.push(obj);
                }
            }

        }).error(function(err) {
            console.error(err)
        });

    }
    $scope.initUser();
    //delete the desired user
    $scope.deleteUser = function(id) {
        $scope.user.id = id
        var uibModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            templateUrl: 'myModalContent.html',
            backdrop: 'static',
            controller: function($uibModalInstance, $scope, $rootScope) {
                $scope.ok = function() {
                    $http.delete(URL + id)
                        .success(function() {
                            uibModalInstance.dismiss();
                            // growlService.growl('User has been Deleted', 'success');
                            $state.go('users');
                        })
                        .error(function() {

                        });
                    // $state.reload();

                };
                $scope.cancel = function() {
                    uibModalInstance.dismiss('cancel');
                };
            },
            size: 'lg'
        });
    }




    $scope.uploadfiles = function() {
        $('#upload_input').click();
    }

    $('#upload_input').on('change', function() {

        var files = $(this).get(0).files;

        if (files.length > 0) {
            // create a FormData object which will be sent as the data payload in the
            var formData = new FormData();

            // loop through all the selected files and add them to the formData object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var newfile = {};

                newfile.style = "background: #21f36e;"
                var x = uuid.v4() + "__name:" + file.name;

                newfile.name = x;

                // $scope.user.files.push(file)
                $scope.user_files.push(newfile)
                    // add the files to formData object for the data payload
                formData.append('uploads[]', file, x);

            }
            formData.append('user_id', user_id);

            $http.post('/uploadFiles/' + user_id,
                    formData, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                .success(function(response) {

                    if ((response) && (response.error == false)) {
                        growlService.growl('File has been uploaded', 'success');
                    }
                    else

                        growlService.growl('File not upload', 'danger');

                })
                .error(function(err) {
                    // console.log(err);
                    growlService.growl('err', 'danger');
                });

        }

    });


    $scope.removeFile = function(file, index) {

        $http.post('/removeFile/' + user_id, {
                file: file
            })
            .success(function(response) {
                // console.log(response);
                if ((response) && (response.error == false)) {
                    $scope.user_files.splice(index, 1);
                    growlService.growl('Successfully deleted', 'success');
                }
                else

                    growlService.growl('File not deleted', 'danger');

            })
            .error(function(err) {
                // console.log(err);
                growlService.growl('err', 'danger');
            });


    }

    $scope.downloadFile = function(file) {
        if (file) {
            var x = new XMLHttpRequest();

            x.open("GET", "https://www.clinique-panel-amenijem.c9users.io/" + user_id + "/" + file, true);

            x.responseType = 'blob';

            x.onload = function(e) {

                download(x.response, file);
            }
            x.send();
        }
    }










});
