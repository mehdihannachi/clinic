  var i18n = require('i18n');

  i18n.configure({
      // setup some locales - other locales default to en silently
      locales: [ 'fr'],
        fallbacks:{'en': 'fr'},

      // where to store json files - defaults to './locales' relative to modules directory
      directory: __dirname + '/../../views/locales',
    autoReload: true,

      defaultLocale: 'fr',
      register: global,

      // sets a custom cookie name to parse locale settings from  - defaults to NULL
      cookie: 'lang',
  });

      i18n.setLocale('fr');
  module.exports = function(req, res, next) {
      i18n.init(req, res);

      var current_locale = i18n.getLocale();
      // console.log(current_locale)
      return next();
  };