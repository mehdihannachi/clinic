
var materialAdmin = angular.module('materialAdmin', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    // 'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable',
    'textAngular',
    'ngAria',
    'ngMaterial',
    'ngSanitize',
    'ngStorage',
    'ngImgCrop',
    'angularMoment',
    'ngImageInputWithPreview',
    'btford.socket-io',
    'luegg.directives',
    'angularSpinner',
    'angularUtils.directives.dirPagination',
    'ui.calendar',
    'angular-uuid'
])

materialAdmin.config(function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
})

