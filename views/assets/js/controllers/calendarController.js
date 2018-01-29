materialAdmin.directive('itemsDrag', function() {
    return {
        link: function(scope, element, attrs) {
            element.draggable({
                helper: 'clone',
                opacity: 0.7,
                cursorAt: {
                    top: 15,
                    left: 50
                },
                appendTo: 'body',
                containment: 'body',
                scroll: true,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });


        }
    };
});

materialAdmin.directive('confirmOnExit', function() {
    return {
        scope: {
            confirmOnExit: '&',
            confirmMessageWindow: '@',
            confirmMessageRoute: '@',
            confirmMessage: '@'
        },
        link: function($scope, elem, attrs) {
            window.onbeforeunload = function() {
                if ($scope.confirmOnExit()) {
                    return $scope.confirmMessageWindow || $scope.confirmMessage;
                }
            }
            var $locationChangeStartUnbind = $scope.$on('$stateChangeStart', function(event, next, current) {
                if ($scope.confirmOnExit()) {
                    if (!confirm($scope.confirmMessageRoute || $scope.confirmMessage)) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function() {
                window.onbeforeunload = null;
                $locationChangeStartUnbind();
            });
        }
    };
});

materialAdmin.controller('calendarController', function($location, $sce, $uibModal, $timeout, $scope, $rootScope, $compile, uiCalendarConfig, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, Socket, usSpinnerService) {
    console.log("calendarController")
        /* config object */
    $scope.uiConfig = {
        calendar: {
            lang: 'fr'
        }
    };
    $scope.exitcalendar = false;

    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 1.5,
            color: '#fff'
        },
        message: '<div id="loader"></div>'
    });

    $scope.isDirty = function() {
        // do your logic and return 'true' to display the prompt, or 'false' otherwise.
        console.log("isDirty")
        return true;
    };

    $rootScope.events = []
        ///calender-get

    var diffArray = function(a, b) {

        var onlyInA = a.filter(function(current) {
            return b.filter(function(current_b) {
                return new Date(current).valueOf() == new Date(current_b).valueOf()
            }).length == 0
        });

        var onlyInB = b.filter(function(current) {
            return a.filter(function(current_a) {
                return new Date(current).valueOf() == new Date(current_a).valueOf()
            }).length == 0
        });

        var result = onlyInA.concat(onlyInB);

        return result
    }



    //return all the consultation by date
    $scope.list_consultation_14_19 = function(today) {
        console.log("list_consultation_14_19");
        var date = new Date(today);
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var newdate_start = new Date(y, m, d, 13, 0);
        var newdate_end = new Date(y, m, d, 19, 0);
        console.log(newdate_start)
        console.log(newdate_end)
        var listdate = new Array();

        var twentyMinutesLater1 = new Date(newdate_start);
        while (twentyMinutesLater1 < newdate_end) {
            listdate.push(twentyMinutesLater1.toString());
            twentyMinutesLater1.setMinutes(twentyMinutesLater1.getMinutes() + 20);

        }
        return listdate;

    }

    //return all consultation reserved bv date
    $scope.list_consultation_reserved = function(today) {
        console.log("list_consultation_reserved");
        var date = new Date(today);
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var newdate_start = new Date(y, m, d, 13, 0);
        var newdate_end = new Date(y, m, d, 19, 0);
        var listdate = new Array();



        for (var i = 0; i < $rootScope.events.length; i++) {




            if (($rootScope.events[i].type == 1) && ($rootScope.events[i].start >= newdate_start) && (($rootScope.events[i].end) <= newdate_end)) {
                listdate.push($rootScope.events[i].start.toString());
            }
        }
        return listdate;

    }

    $rootScope.get_calendar = function() {
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
        $http.get('/calender-get')
            .success(function(data) {
                // console.log(data.events.length != 0)


                if ((data.error == false) && (data.events.length != 0)) {
                    // $rootScope.events = []
                    $rootScope.events.splice(0, $rootScope.events.length);

                    $scope.token_calendar = data.events[0].token;
                    $scope._idcalendar = data.events[0]._id;
                    $rootScope.calendar_update_at = data.events[0].update_at;



                    for (var i = 0; i < data.events[0].events.length; i++) {
                        data.events[0].events[i]._id = i + 1;
                        data.events[0].events[i].start = new Date(data.events[0].events[i].start)
                        data.events[0].events[i].end = new Date(data.events[0].events[i].end)
                        if (data.events[0].events[i].start_consultation)
                            data.events[0].events[i].start_consultation = new Date(data.events[0].events[i].start_consultation)

                        $rootScope.events.push(data.events[0].events[i])

                    }




                    console.log('$rootScope.events first')
                    console.log($rootScope.events)

                    var oneday = '2017-04-07T12:00:00.000Z';

                    //Date 2017-04-05T12:00:00.000Z
                    console.log("------------------$scope.list_consultation_14_19-------------------------");
                    var tab1 = $scope.list_consultation_14_19(oneday);
                    console.log(tab1);
                    console.log("-------------------------------------------");

                    console.log("----------------------$scope.list_consultation_reserved---------------------");
                    var tab2 = $scope.list_consultation_reserved(oneday)
                    console.log(tab2);
                    console.log("-------------------------------------------");


                    console.log("----------------Consultation non reserved yet ------------")
                    console.log(diffArray(tab1, tab2))




                    // $scope.myCalendar.fullCalendar( 'refetchEvents' );
                }
                else if (data.error == true) {
                    growlService.growl('There was an error processing your order. Please try again!', 'danger');
                }

            }).error(function(err) {
                growlService.growl('There was an error processing your order. Please try again!', 'danger');
            });


        setTimeout($.unblockUI, 10);


    }

    $rootScope.get_calendar();


    $rootScope.save_calendar = function(push) {
        $scope.exitcalendar = false;
        if (!push)
            push = false

        $http.post('/calender-save', {
            events: $rootScope.events,
            idcalendar: $scope._idcalendar,
            token: $scope.token_calendar,
            push: push
        }).success(function(data) {
            if ((data.error == false) && (data.saved == true)) {

                console.log('data')
                console.log(data)
                $scope._idcalendar = data.events._id;
                $scope.token_calendar = data.events.token;
                $rootScope.calendar_update_at = data.events.update_at;

                growlService.growl('Calendar has updated Successfully!', 'success');
                // console.log("$rootScope.events after saved")
                // console.log($rootScope.events)
            }
            else if ((data.error == false) && (data.saved == false)) {
                // console.log(data.events)
                // $scope.conflict_time = data.events.update_at;
                console.log("conflict")
                var uibModalConflict = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    animation: true,
                    templateUrl: 'conflictModalContent.html',
                    backdrop: 'static',
                    controller: function($uibModalInstance, $scope, $rootScope) {

                        $scope.push = function() {
                            $rootScope.save_calendar(true);
                            $rootScope.get_calendar();
                            uibModalConflict.dismiss('cancel');

                        };
                        $scope.pull = function() {
                            $rootScope.get_calendar();
                            uibModalConflict.dismiss('cancel');
                        };

                    },
                    size: 'sm'
                });

            }
            else if (data.error == true) {
                growlService.growl('There was an error processing your order. Please try again!', 'danger');
            }


        }).error(function(err) {
            growlService.growl('There was an error processing your order. Please try again!', 'danger');
        });
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.listpatientsearch = false;
    $scope.listdoctorsSearch = false;


    $rootScope.select_Appointement = function(selector, type) {
        console.log("select_Appointement")
            // type = 0 => doctor
            // type = 1 => patient


        $rootScope.selector_ = selector
        $rootScope.selector_.type = type

        $rootScope.selected_appointement = true;
        $rootScope.selector_position = "";
        $rootScope.selector_picture = selector.profile_picture
        $rootScope.selector_fullname = selector.firstName + " " + selector.lastName;
        if (selector.position)
            $rootScope.selector_position = selector.position


    }

    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view) {
        $rootScope.delete_appointement = true;
        console.log("alertOnEventClick")


        var startTmp = new Date();
        startTmp.setTime(date._start._d.getTime());


        var modalInstance = $uibModal.open({
            templateUrl: 'addEvent.ejs',
            controller: 'addeventCtrls',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                calendarData: function() {
                    var x = [startTmp, $rootScope.events, $rootScope.eventSource, date]
                    return x;
                }
            }
        });

    };

    var hisDoctorChanged = function(doc_id, dayToCompare) {
        dayToCompare = new Date(dayToCompare);
        for (var i = 0; i < $rootScope.events.length; i++) {
            var startday = new Date($rootScope.events[i].start);
            var endday = new Date($rootScope.events[i].end);
            if (($rootScope.events[i].type == 0) && ($rootScope.events[i].id == doc_id) && (dayToCompare >= startday) && (dayToCompare <= endday)) {
                return true;

            }
        }
        return false;
    }

    $rootScope.addTime_topatient = function(doc, patient) {
        console.log("addtime");
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].type == 0) && ($rootScope.events[i].id == doc.id) && (patient.doctor == $rootScope.events[i].id) &&
                (new Date($rootScope.events[i].start).getFullYear() == new Date(patient.start).getFullYear()) &&
                (new Date($rootScope.events[i].start).getMonth() == new Date(patient.start).getMonth()) &&
                (new Date($rootScope.events[i].start).getDate() == new Date(patient.start).getDate())) {


                if (!$rootScope.events[i].start_consultation) {
                    $rootScope.events[i].start_consultation = $rootScope.events[i].start
                }

                var twentyMinutesLater = new Date($rootScope.events[i].start_consultation);
                twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20);

                if (twentyMinutesLater > new Date($rootScope.events[i].end)) {
                    // console.error(twentyMinutesLater)
                    // console.error(new Date($rootScope.events[i].end))
                    // console.error((twentyMinutesLater > new Date($rootScope.events[i].end)))
                    return false;
                }
                else {
                    patient.start = new Date($rootScope.events[i].start_consultation);
                    patient.end = new Date(twentyMinutesLater);
                    $rootScope.events[i].start_consultation = new Date(twentyMinutesLater);
                    return true;
                }
            }
        }
    }



    $rootScope.detect_consultation_vide = function(doc, _listPatient) {
        console.log('detect_consultation_vide')


        if (_listPatient.length == 0) {
            // console.log('vide')
            return false;
        }
        else {
            // console.log('not vide')
            var start_consult = doc.start;
            var available_consult = [];
            var unavailable_consult = [];
            while (new Date(start_consult) < new Date(doc.end)) {

                available_consult.push(start_consult)
                start_consult = new Date(start_consult);
                start_consult.setMinutes(start_consult.getMinutes() + 20);

            }

            for (var i = 0; i < _listPatient.length; i++) {
                unavailable_consult.push(_listPatient[i].start)
            }

            // console.log('available_consult')
            // console.log(available_consult)
            // console.log('unavailable_consult')
            // console.log(unavailable_consult)
            var result = diffArray(available_consult, unavailable_consult)

            if (result.length == 0)
                return false
            else
                return result


        }
    }

    $scope.numberOfdoctor = function(day, month, year) {
        // console.error('numberOfdoctor')
        var count = [];
        for (var j = 0; j < $rootScope.events.length; j++) {
            var j_d = new Date($rootScope.events[j].start).getDate(); //day
            var j_m = new Date($rootScope.events[j].start).getMonth(); //month
            var j_y = new Date($rootScope.events[j].start).getFullYear(); //year

            if (($rootScope.events[j].type == 0) && (j_y == year) && (j_m == month) && (j_d == day)) {
                count.push($rootScope.events[j])
            }
        }
        return count;
    }

    $scope.listEvent_doc = function(doc) {
        var listpatient = []
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].type == 1) && ($rootScope.events[i].affected == true) && ($rootScope.events[i].doctor == doc.id) &&
                ($rootScope.events[i].start >= doc.start) &&
                ($rootScope.events[i].end) <= doc.end) {
                var newobj = $rootScope.events[i];
                newobj.start_h_m = new Date(newobj.start).getHours() + ":" + new Date(newobj.start).getMinutes();
                newobj.end_h_m = new Date(newobj.end).getHours() + ":" + new Date(newobj.end).getMinutes();


                listpatient.push(newobj);
            }
        }
        return listpatient;
    }

    $rootScope.refrech = function() {
        console.error("refrech")
        $scope.exitcalendar = true;

        for (var i = 0; i < $rootScope.events.length; i++) {


            if ($rootScope.events[i].type == 1) { //if patient
                var g_d = new Date($rootScope.events[i].start).getDate();
                var g_m = new Date($rootScope.events[i].start).getMonth();
                var g_y = new Date($rootScope.events[i].start).getFullYear();
                var _numDoc = $scope.numberOfdoctor(g_d, g_m, g_y); // number of doctor and return table
                if (($rootScope.events[i].affected == false) && (_numDoc.length == 1)) { //patient not affected and doctor = 1;
                    console.log("Exc1")
                    $rootScope.events[i].className = 'bgm-blue'
                    $rootScope.events[i].doctor = _numDoc[0].id
                    $rootScope.events[i].affected = true
                    $rootScope.events[i].allDay = false;
                    if ($rootScope.addTime_topatient(_numDoc[0], $rootScope.events[i]) == false) {
                        console.log("Exc1.1")
                        $rootScope.events[i].className = 'bgm-red'
                        $rootScope.events[i].doctor = "";
                        $rootScope.events[i].affected = false
                        $rootScope.events[i].allDay = true;
                    }
                }
                else if (($rootScope.events[i].affected == false) && (_numDoc.length == 0)) { //patient not affected and doctor = 0;
                    console.log("Exc2")
                    $rootScope.events[i].className = 'bgm-red'
                    $rootScope.events[i].doctor = "";
                    $rootScope.events[i].affected = false
                    $rootScope.events[i].allDay = false;
                }
                else if (($rootScope.events[i].affected == false) && (_numDoc.length > 1)) { //patient not affected and doctor > 1;
                    console.log("Exc3")
                    $rootScope.events[i].className = 'bgm-orange'
                    $rootScope.events[i].doctor = ""
                    $rootScope.events[i].affected = false
                    $rootScope.events[i].allDay = true;
                    var date = new Date(g_y, g_m, g_d);


                    var modalInstance2 = $uibModal.open({
                        templateUrl: 'chooseDoctor.ejs',
                        controller: 'chooseDoctorCtrl',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            Data: function() {
                                var x = [$rootScope.events[i], date]
                                return x;
                            }
                        }
                    });
                    break;
                }
                else if (($rootScope.events[i].affected == true) && (_numDoc.length == 0)) { //patient  affected and doctor = 0;
                    console.log("Exc4")
                    $rootScope.events[i].className = 'bgm-red'
                    $rootScope.events[i].doctor = "";
                    $rootScope.events[i].affected = false
                    $rootScope.events[i].allDay = false;
                }
                else if (($rootScope.events[i].affected == true) && (_numDoc.length == 1) && (hisDoctorChanged($rootScope.events[i].doctor, $rootScope.events[i].start) == false)) { //patient affected and doctor = 1 but his doctor changed;
                    console.log("Exc5")
                    $rootScope.events[i].className = 'bgm-blue'
                    $rootScope.events[i].doctor = _numDoc[0].id
                    $rootScope.events[i].affected = true
                    $rootScope.events[i].allDay = false;

                    if ($rootScope.addTime_topatient(_numDoc[0], $rootScope.events[i]) == false) {
                        console.log("Exc6")
                        $rootScope.events[i].className = 'bgm-red'
                        $rootScope.events[i].doctor = "";
                        $rootScope.events[i].affected = false
                        $rootScope.events[i].allDay = true;
                    }
                }
            }
            else if ($rootScope.events[i].type == 0) //doctor
            {
                console.log("Exc7")
                if ($scope.listEvent_doc($rootScope.events[i]).length == 0) {
                    // console.error("doctor start consultation 0")
                    $rootScope.events[i].start_consultation = new Date($rootScope.events[i].start)
                }
            }


        }


        console.log('$rootScope.events from refrech');
        console.log($rootScope.events)


    }

    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
        console.log("alertOnDrop")

        console.log('event')
        console.log(event)
        if (event.type == 0) //doctor
        {
            var s_h = 13;
            var e_h = 19;
            var s_m = 0;
            var e_m = 0;

        }
        else if (event.type == 1) //patient
        {
            var s_h = 0;
            var e_h = 0;
            var s_m = 0;
            var e_m = 0;

        }




        if (event.start) {
            var s_h = new Date(event.start).getUTCHours();
            var d = new Date(event.start).getUTCDate();
            var s_m = new Date(event.start).getUTCMinutes();
            var m = new Date(event.start).getUTCMonth();
            var y = new Date(event.start).getUTCFullYear();

        }
        if (event.end) {
            var e_h = new Date(event.end).getUTCHours();
            var e_m = new Date(event.end).getUTCMinutes();
        }

        if ($rootScope.verifEvent(event, y, m, d, s_h, e_h, s_m, e_m) == true) {
            // console.error("revertFunc")
            revertFunc()
        }
        else {
            for (var i = 0; i < $rootScope.events.length; i++) {
                // console.log("**************")
                // console.log($rootScope.events[i]._id)
                // console.log(event._id)
                // console.log(($rootScope.events[i]._id == event._id))

                if (($rootScope.events[i]._id == event._id) && (event.type == 1)) {
                    $rootScope.events[i].className = 'bgm-red'
                    $rootScope.events[i].affected = false
                    $rootScope.events[i].doctor = ""
                    $rootScope.events[i].allDay = true;
                    $rootScope.events[i].start = new Date(y, m, d)
                    $rootScope.events[i].end = new Date(y, m, d)
                        // console.log("ymd")
                        // console.log(y)
                        // console.log(m)
                        // console.log(d)




                }
                else if (($rootScope.events[i]._id == event._id) && (event.type == 0)) {
                    $rootScope.events[i].start = new Date(y, m, d, s_h, s_m)
                    $rootScope.events[i].end = new Date(y, m, d, e_h, e_m)
                    $rootScope.events[i].start_consultation = $rootScope.events[i].start
                }

            }

        }
        $rootScope.refrech();




    };

    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
        console.log("alertOnResize")
            // type = 0 => doctor
            // type = 1 => patient
        if (event.type == 0) {
            // console.log(event)

            if (event.start) {
                var s_h = new Date(event.start).getUTCHours();
                var d = new Date(event.start).getUTCDate();
                var s_m = new Date(event.start).getUTCMinutes();
                var m = new Date(event.start).getUTCMonth();
                var y = new Date(event.start).getUTCFullYear();

            }
            if (event.end) {
                var e_h = new Date(event.end).getUTCHours();
                var e_m = new Date(event.end).getUTCMinutes();
            }

            if ($rootScope.verifEvent(event, y, m, d, s_h, e_h, s_m, e_m) == true) {
                // console.error("revertFunc")
                revertFunc()
            }
            else {
                for (var i = 0; i < $rootScope.events.length; i++) {
                    if (($rootScope.events[i]._id == event._id) && (event.type == 0)) {
                        $rootScope.events[i].start = new Date(y, m, d, s_h, s_m)
                        $rootScope.events[i].end = new Date(y, m, d, e_h, e_m)
                    }
                }

                $rootScope.refrech();
            }


        }
        else
            revertFunc();



    };

    $scope.dayClick = function(date, jsEvent, view) {
        console.log("dayClick")
            // console.log('date')
            // console.log(date)
            // console.log("jsEvent")
            // console.log(jsEvent)
            // console.log('view')
            // console.log(view)

        var startTmp = new Date();
        startTmp.setTime(date._d.getTime());
        var endTmp = new Date();
        endTmp.setTime(startTmp.getTime() + (60 * 60 * 1000));

        console.log('startTmp')
        console.log(startTmp)
        $rootScope.selected_appointement = false;

        var modalInstance = $uibModal.open({
            templateUrl: 'addEvent.ejs',
            controller: 'addeventCtrls',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                calendarData: function() {
                    var x = [startTmp, $rootScope.events, $rootScope.eventSource]
                    return x;
                }
            }
        });
    }

    /* Render Tooltip */
    $scope.eventRender = function(event, element, view) {


        element.find(".editEvent").bind('click', function() {
            $scope.editEvent(event);
            return false;
        });
        element.find(".deleteEvent").bind('click', function() {
            $scope.deleteEvent(event);
            return false;
        });

        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };

    $scope.drop = function(data) {
        console.log("drop data")
        console.log('data')
        console.log(data)
        var startTmp = new Date();
        startTmp.setTime(data._d.getTime());
        var d = startTmp.getDate();
        var m = startTmp.getMonth();
        var y = startTmp.getFullYear();
        var start_h = startTmp.getHours();
        var start_m = startTmp.getMinutes();
        var endTmp = new Date(startTmp);
        endTmp.setMinutes(endTmp.getMinutes() + 20);


        var end_h = endTmp.getHours();
        var end_m = endTmp.getMinutes();


        console.log('start_h')
        console.log(start_h)
        console.log('start_m')
        console.log(start_m)

        var obj = eval('({' + $(this).context.id + '})');


        if ((start_h == 1) && (start_m == 0)) {

            start_h = 14
            start_m = 0
            if (obj.type == 0) {
                end_h = 20
                end_m = 0

            }
            else if (obj.type == 1) {

                end_h = 14
                end_m = 20
            }

        }





        var num_events = $rootScope.events.length;

        if ($rootScope.events.length != 0)
            var new_id = $rootScope.events[num_events - 1]._id
        else if ($rootScope.events.length == 0)
            var new_id = 0

        // type = 0 => doctor
        // type = 1 => patient
        if ((obj.type == 1) && (($rootScope.verifEvent(obj, y, m, d, start_h - 1, start_m, end_h - 1, end_m) == false))) {
            console.log(start_h)
            console.log(start_m)
            console.log(end_h)
            console.log(end_m)

            $rootScope.events.push({
                _id: new_id + 1,
                title: $(this).text(),
                id: obj.id,
                type: obj.type,
                start: new Date(y, m, d, start_h - 1, start_m),
                end: new Date(y, m, d, end_h - 1, end_m),
                allDay: false,
                className: 'bgm-red',
                stick: true,
                affected: false
            });
            // $rootScope.refrech();
        }
        else if ((obj.type == 0) && ($rootScope.verifEvent(obj, y, m, d, start_h - 1, start_m, end_h - 1, end_m) == false)) {


            $rootScope.events.push({
                _id: new_id + 1,
                title: $(this).text(),
                id: obj.id,
                type: obj.type,
                start: new Date(y, m, d, start_h - 1, start_m),
                end: new Date(y, m, d, end_h - 1, end_m),
                allDay: false,
                className: $scope.tags[Math.floor(Math.random() * $scope.tags.length)],
                stick: true
            });
        }
        $rootScope.refrech();
    }

    $rootScope.doctorExist = function(obj, y, m, d, h1, h2, m1, m2) {
        if (obj.type == 0) //doctor
        {
            var s_h = 13;
            var e_h = 19;
            var s_m = 0;
            var e_m = 0;
        }
        else if (obj.type == 1) //patient
        {
            var s_h = 0;
            var e_h = 0;
            var s_m = 0;
            var e_m = 0;
        }


        if (h1)
            s_h = h1
        if (h2)
            e_h = h2
        if (m1)
            s_m = m1
        if (m2)
            e_m = m2

        for (var i = 0; i < $rootScope.events.length; i++) {

            if (($rootScope.events[i].type == 0) && (new Date($rootScope.events[i].start).valueOf() == new Date(y, m, d, s_h, s_m).valueOf()) && (new Date($rootScope.events[i].end).valueOf() == new Date(y, m, d, e_h, e_m).valueOf())) {

                return true;

            }
        }
        return false;
    }

    $rootScope.verifEvent = function(obj, y, m, d, h1, h2, m1, m2) {
        // console.error('verifEvent')

        if (obj.type == 0) //doctor
        {
            var s_h = 13;
            var e_h = 19;
            var s_m = 0;
            var e_m = 0;

            if (h1)
                s_h = h1
            if (h2)
                e_h = h2
            if (m1)
                s_m = m1
            if (m2)
                e_m = m2


            // console.log(obj);
            // console.log(y);
            // console.log(m);
            // console.log(d);
            // console.log(h1);
            // console.log(h2);
            // console.log(m1);
            // console.log(m2);

            // console.log(new Date(y, m, d, s_h, s_m).valueOf())
            // console.log(new Date(y, m, d, e_h, e_m).valueOf())
            // console.log("------------------");

            for (var i = 0; i < $rootScope.events.length; i++) {

                if (((($rootScope.events[i].id == obj.user_id) || ($rootScope.events[i].id == obj.id)) && (new Date($rootScope.events[i].start).valueOf() == new Date(y, m, d, s_h, s_m).valueOf()) &&
                        (new Date($rootScope.events[i].end).valueOf() == new Date(y, m, d, e_h, e_m).valueOf()))) {

                    return true;
                }

                // if ($rootScope.events[i].id == obj.user_id)
                // {
                //   console.log(new Date($rootScope.events[i].start).valueOf())
                //   console.log(new Date($rootScope.events[i].end).valueOf())


                // }
            }


        }
        else if (obj.type == 1) //patient
        {
            for (var i = 0; i < $rootScope.events.length; i++) {
                if ((($rootScope.events[i].id == obj.user_id) || ($rootScope.events[i].id == obj.id)) && (new Date($rootScope.events[i].start).getDate() == d) &&
                    (new Date($rootScope.events[i].start).getMonth() == m) && (new Date($rootScope.events[i].start).getFullYear() == y)) {
                    return true;
                }
            }
        }


        return false;

    }

    /* Calendar config object */
    $scope.uiConfig = {
        calendar: {
            editable: true,
            theme: true, //Do not remove this as it ruin the design
            selectable: true,
            selectHelper: true,
            scrollTime: '13:00:00',
            slotDuration: '00:20:00',
            snapDuration: '00:20:00',
            droppable: true, // this allows things to be dropped onto the calendar
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay', // month basicWeek basicDay agendaWeek agendaDay
                center: 'prev, title, next',
                right: 'today'
            },
            defaultView: 'agendaWeek',
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,
            dayClick: $scope.dayClick,
            drop: $scope.drop
        },
        calendar_small: {
            editable: false,
            theme: true, //Do not remove this as it ruin the design
            selectable: true,
            selectHelper: true,
            scrollTime: '12:00:00',
            slotDuration: '00:20:00',
            snapDuration: '00:20:00',
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

    /* event sources array*/
    $rootScope.eventSources = [$rootScope.events];
















})




//Add event Controller (Modal Instance)
.controller('addeventCtrls', function($scope, $rootScope, $uibModalInstance, calendarData) {
    console.log("addeventCtrls")

    $scope.calendarData = calendarData[0];
    $scope.events = calendarData[1];
    $rootScope.eventSource = calendarData[2];

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
        console.log('ontagClick')
        $scope.activeState = $index;
        $scope.activeTagColor = tag;
    }

    $scope.updateEvent = function() {
        $scope.eventdata = calendarData[3];
        console.log("DeleteEvent")
            //.getElementById("my-element").remove();


        // console.log('$scope.eventdata._id')
        // console.log($scope.eventdata._id)



        for (var i = 0; i < $rootScope.events.length; i++) {
            // console.log($rootScope.events[i])
            if ($rootScope.events[i]._id == $scope.eventdata._id) {
                // console.log('($rootScope.events[i]._id == $scope.eventdata._id)')
                // console.log(($rootScope.events[i]._id == $scope.eventdata._id))
                $rootScope.events.splice(i, 1);
                break;
            }
        }


        // console.log('$rootScope.events')
        // console.log($rootScope.events)

        $rootScope.eventSources = [$rootScope.events, $rootScope.eventSource];
        $scope.refrech();
        $scope.eventDismiss();

    }


    $scope.listEvent_doc = function(doc) {
        var listpatient = []
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].type == 1) && ($rootScope.events[i].affected == true) && ($rootScope.events[i].doctor == doc.id) &&
                ($rootScope.events[i].start >= doc.start) &&
                ($rootScope.events[i].end) <= doc.end) {
                var newobj = $rootScope.events[i];
                newobj.start_h_m = new Date(newobj.start).getHours() + ":" + new Date(newobj.start).getMinutes();
                newobj.end_h_m = new Date(newobj.end).getHours() + ":" + new Date(newobj.end).getMinutes();


                listpatient.push(newobj);
            }
        }
        return listpatient;
    }





    //Add new event
    $scope.addEvent = function(selector, start, end) {




        // type = 0 => doctor
        // type = 1 => patient

        if (selector) {

            if (selector.type == 0) {
                var s_h = 9;
                var s_m = 0;
                var e_h = 17;
                var e_m = 0;

            }
            else if (selector.type == 1) {
                var s_h = 9;
                var s_m = 0;
                var e_h = 9;
                var e_m = 20;

            }

            if (start) {
                if (start.h)
                    s_h = start.h;

                if (start.m)
                    s_m = start.m
            }

            if (end) {
                if (end.h)
                    e_h = end.h;
                if (end.m)
                    e_m = end.m
            }

            var date = new Date($scope.calendarData);
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();
            var num_events = $rootScope.events.length;



            if ($rootScope.events.length != 0)
                var new_id = $rootScope.events[num_events - 1]._id
            else if ($rootScope.events.length == 0)
                var new_id = 0


            if (selector.type == 0) //doctor
            {

                if ($rootScope.verifEvent(selector, y, m, d, s_h, e_h, s_m, e_m) == false) {
                    $rootScope.events.push({
                        _id: new_id + 1,
                        id: selector.user_id,
                        type: 0,
                        title: selector.firstName + " " + selector.lastName,
                        comment: $scope.comment,
                        phone: $scope.number,
                        start: new Date(y, m, d, s_h, s_m),
                        end: new Date(y, m, d, e_h, e_m),
                        allDay: false,
                        className: $scope.tags[Math.floor(Math.random() * $scope.tags.length)],
                        stick: true
                    });
                }


                $rootScope.refrech();

                $uibModalInstance.close();
            }
            else if (selector.type == 1) //patient
            {
                if ($rootScope.verifEvent(selector, y, m, d, s_h, e_h, s_m, e_m) == false) {
                    console.log("no patienttttttttttttttt")

                    $rootScope.events.push({
                        _id: new_id + 1,
                        title: selector.firstName + " " + selector.lastName,
                        id: selector.user_id,
                        type: 1,
                        start: new Date(y, m, d, s_h, s_m),
                        end: new Date(y, m, d, e_h, e_m),
                        allDay: true,
                        className: 'bgm-red',
                        stick: true,
                        affected: false
                    });
                    $rootScope.refrech();
                }

                $uibModalInstance.close();
            }
        }
    }

    //Dismiss 
    $scope.eventDismiss = function() {
        $rootScope.delete_appointement = false;
        $uibModalInstance.dismiss();
    }


    //delete event
    $scope.DeleteEvent = function() {

        $scope.eventdata = calendarData[3];
        console.log("DeleteEvent")
            //.getElementById("my-element").remove();


        // console.log('$scope.eventdata._id')
        // console.log($scope.eventdata._id)



        for (var i = 0; i < $rootScope.events.length; i++) {
            // console.log($rootScope.events[i])
            if ($rootScope.events[i]._id == $scope.eventdata._id) {
                // console.log('($rootScope.events[i]._id == $scope.eventdata._id)')
                // console.log(($rootScope.events[i]._id == $scope.eventdata._id))
                $rootScope.events.splice(i, 1);
                break;
            }
        }




        // console.log('$rootScope.events')
        // console.log($rootScope.events)

        $rootScope.eventSources = [$rootScope.events, $rootScope.eventSource];
        $scope.refrech();
        $scope.eventDismiss();
    }



})


//Choose one doctor for one patient Controller (Modal Instance)
.controller('chooseDoctorCtrl', function($scope, $rootScope, $uibModalInstance, Data) {
    console.log("chooseDoctorCtrl*")

    $scope.patient = Data[0];
    $scope.date = Data[1];
    $scope.consult_date = moment($scope.date).format('MMMM Do YYYY');
    var consult_day = new Date($scope.date).getDate();
    var consult_month = new Date($scope.date).getMonth();
    var consult_year = new Date($scope.date).getFullYear();

    $scope.listEvent_doc = function(doc) {
        var listpatient = []
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].type == 1) && ($rootScope.events[i].affected == true) && ($rootScope.events[i].doctor == doc.id) &&
                ($rootScope.events[i].start >= doc.start) &&
                ($rootScope.events[i].end) <= doc.end) {
                var newobj = $rootScope.events[i];
                newobj.start_h_m = new Date(newobj.start).getHours() + ":" + new Date(newobj.start).getMinutes();
                newobj.end_h_m = new Date(newobj.end).getHours() + ":" + new Date(newobj.end).getMinutes();


                listpatient.push(newobj);
            }
        }
        return listpatient;
    }

    //Return doctors by day ,month and year specific
    var doctors_byday = function(day, month, year) {
        var _doctors = [];
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].type == 0) && (new Date($rootScope.events[i].start).getDate() == day) && (new Date($rootScope.events[i].start).getMonth() == month) && (new Date($rootScope.events[i].start).getFullYear() == year)) {
                var obj = $rootScope.events[i]
                obj.start_h_m = new Date(obj.start).getHours() + ":" + new Date(obj.start).getMinutes();
                obj.end_h_m = new Date(obj.end).getHours() + ":" + new Date(obj.end).getMinutes();
                obj.patients = $scope.listEvent_doc($rootScope.events[i])
                _doctors.push(obj);
            }
        }
        return _doctors;

    }

    $scope.complet = false;

    var getEventsbydoctors = function(doc_id, start, end) {
        console.log("getEventsbydoctors")
            // console.log('doc_id')
            // console.log(doc_id)
            // console.log('start')
            // console.log(start)
            // console.log('end')
            // console.log(end)

        var patientbydoc = []
        for (var i = 0; i < $rootScope.events.length; i++) {
            // console.log($rootScope.events[i].title)
            // console.log(($rootScope.events[i].type == 1) && ($rootScope.events[i].affected == true) && ($rootScope.events[i].doctor == doc_id))
            // console.log(new Date($rootScope.events[i].start).getDate() == new Date(start).getDate())
            // console.log(new Date($rootScope.events[i].start).getMonth() == new Date(start).getMonth())
            // console.log(new Date($rootScope.events[i].start).getFullYear() == new Date(start).getFullYear())
            if (($rootScope.events[i].type == 1) && ($rootScope.events[i].affected == true) && ($rootScope.events[i].doctor == doc_id) &&
                (new Date($rootScope.events[i].start).getDate() == new Date(start).getDate()) &&
                (new Date($rootScope.events[i].start).getMonth() == new Date(start).getMonth()) &&
                (new Date($rootScope.events[i].start).getFullYear() == new Date(start).getFullYear())) {
                patientbydoc.push($rootScope.events[i])
            }

        }
        return patientbydoc;

    }

    // console.log('doctors_byday(consult_day,consult_month,consult_year)')
    $scope.doctorsbyday = doctors_byday(consult_day, consult_month, consult_year);

    // console.log('getEventsbydoctors(doctorsbyday[0].id, doctorsbyday[0].start, doctorsbyday[0].end)')
    // console.log(getEventsbydoctors($scope.doctorsbyday[0].id, $scope.doctorsbyday[0].start, $scope.doctorsbyday[0].end))

    $scope.setdoctor_topatient = function(doc, patient) {
        for (var i = 0; i < $rootScope.events.length; i++) {
            if (($rootScope.events[i].id == patient.id) && ($rootScope.events[i].affected == false) &&
                (new Date($rootScope.events[i].start).getFullYear() == new Date(patient.start).getFullYear()) &&
                (new Date($rootScope.events[i].start).getDate() == new Date(patient.start).getDate()) &&
                (new Date($rootScope.events[i].start).getHours() == new Date(patient.start).getHours())) {
                $rootScope.events[i].className = 'bgm-blue'
                $rootScope.events[i].doctor = doc.id;
                $rootScope.events[i].affected = true;
                $rootScope.events[i].allDay = false;
                // $rootScope.addTime_topatient(doc, $rootScope.events[i]);
                // console.error('$rootScope.detect_consultation_vide(doc,$scope.listEvent_doc(doc))')
                // console.log()
                var detect_consultation = $rootScope.detect_consultation_vide(doc, $scope.listEvent_doc(doc));
                var _addTime_topatient = $rootScope.addTime_topatient(doc, $rootScope.events[i])
                console.log(detect_consultation)

                if ((_addTime_topatient == false) && (detect_consultation == false)) { //complet
                    // $rootScope.events[i].className = 'bgm-red'
                    // $rootScope.events[i].doctor = "";
                    // $rootScope.events[i].affected = false
                    // $rootScope.events[i].allDay = true;
                    $rootScope.events[i].className = 'bgm-orange'
                    $rootScope.events[i].doctor = ""
                    $rootScope.events[i].affected = false
                    $rootScope.events[i].allDay = true;
                    $scope.complet = true;
                }
                else if ((_addTime_topatient == false) && (detect_consultation != false)) { // there is date
                    $rootScope.events[i].className = 'bgm-blue'
                    $rootScope.events[i].doctor = doc.id;
                    $rootScope.events[i].affected = true;
                    $rootScope.events[i].allDay = false;

                    // console.log('detect_consultation.length[0]')


                    $rootScope.events[i].start = new Date(detect_consultation[0]);

                    var _twentyMinutesLater = new Date(detect_consultation[0]);
                    _twentyMinutesLater.setMinutes(_twentyMinutesLater.getMinutes() + 20);

                    $rootScope.events[i].end = new Date(_twentyMinutesLater);
                    $scope.eventDismiss()
                    $rootScope.refrech()

                }
                else {

                    $scope.eventDismiss()
                }
                // console.log('$rootScope.addTime_topatient(doc,patient)');
                // console.log($rootScope.addTime_topatient(doc,patient));
            }
        }

        // console.log('$rootScope.events')
        // console.log($rootScope.events)

    }



    //Dismiss 
    $scope.eventDismiss = function() {
        $uibModalInstance.dismiss();
    }

})
