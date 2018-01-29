'use strict';

// Declare app level module which depends on views, and components
var laRose = angular.module('laRose', [
    'ngRoute',
    'ui.router',
    'oc.lazyLoad',
    'ngResource',
    'tabs',
    'angular-timeline',
    'angular-scroll-animate',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngProgress',
    'angularMoment'
  ]).config(function($stateProvider, $urlRouterProvider, $uiViewScrollProvider, $locationProvider) {
    $uiViewScrollProvider.useAnchorScroll()



    $urlRouterProvider.otherwise('404');

    $stateProvider
      .state('accueil', {
        url: '/',
        templateUrl: 'views/home.html'

      })
      .state('accueil2', {
        url: '/rdv',
        templateUrl: 'views/appointment.html'

      })
      .state('404', {
        url: '/404',
        templateUrl: 'views/404.html'

      })

    .state('history', {
        url: '/historique',
        templateUrl: 'views/history.html'
      })
      .state('news', {
        url: '/actualite',
        templateUrl: 'views/blog.html'
      })
      .state('medical-services', {
        url: '/medical-services',
        templateUrl: 'views/medical-services.html'
      })
      .state('login', {
        url: '/connexion',
        templateUrl: 'views/login.html'
      })
      .state('signup', {
        url: '/inscription',
        templateUrl: 'views/signup.html'
      })
      .state('signup-step2', {
        url: '/incription-suite',
        templateUrl: 'views/signup-step2.html'
      })
      .state('forgot-password', {
        url: '/recuperation-motdepasse',
        templateUrl: 'views/forgot-password.html'
      })
      .state('fiv', {
        url: '/fecondation-in-vitro',
        templateUrl: 'views/fecondation-in-vitro.html'

      })
      .state('iiu', {
        url: '/insemination-intra-uterine',
        templateUrl: 'views/insemination-intra-uterine.html'
      })
      .state('icsi', {
        url: '/injection-intra-cytoplasmique',
        templateUrl: 'views/icsi.html'
      })
      .state('fertility', {
        url: '/preservation-fertilite',
        templateUrl: 'views/fertility.html'
      })
      .state('intimity', {
        url: '/vie-privee',
        templateUrl: 'views/intimity.html'
      })
      .state('team', {
        url: '/equipe-medical',
        templateUrl: 'views/team.html'
      })
      .state('psychologie', {
        url: '/support-psychologique',
        templateUrl: 'views/psychologie.html'
      })
      .state('patient-avant-tout', {
        url: '/patient-avant-tout',
        templateUrl: 'views/patient-avant-tout.html'
      })
      .state('missions', {
        url: '/missions-valeur',
        templateUrl: 'views/missions.html'
      })
      .state('diagnostic', {
        url: '/diagnostics',
        templateUrl: 'views/diagnostic.html'
      })
      .state('traitement', {
        url: '/traitements-medicaux',
        templateUrl: 'views/traitements.html'
      })
      .state('congelation-embryon', {
        url: '/congelation-embryon',
        templateUrl: 'views/congelation-embryon.html'
      })
      .state('congelation-sperm', {
        url: '/congelation-sperme',
        templateUrl: 'views/congelation-sperm.html'
      })
      .state('tracabilite', {
        url: '/tracabilite',
        templateUrl: 'views/tracabilite.html'
      })
      .state('haute-technologie', {
        url: '/hautes-technologies',
        templateUrl: 'views/haute-technologie.html'
      })
      .state('expertise', {
        url: '/expertise-medecins',
        templateUrl: 'views/expertise.html'
      })
      .state('transfert', {
        url: '/transfert-embryons-congeles',
        templateUrl: 'views/transfert.html'
      });


    // use the HTML5 History API
    // $locationProvider.html5Mode(true);


  })
  .run(function(Progress, $timeout, $rootScope) {
    $rootScope.$on('$locationChangeStart', function() {
      Progress.start();
      $(".wpc-preloader").show();
      $timeout(function() {
        $(".wpc-preloader").hide()
      }, 2000);
    });
  })
