'use strict';

//socket factory that provides the socket service
materialAdmin.factory('Socket', ['socketFactory', function(socketFactory) {
 return socketFactory();
}])