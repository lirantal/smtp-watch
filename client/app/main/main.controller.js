'use strict';

angular.module('lirantalSmtpWatchApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.mails = [];

    $http.get('/api/mails').success(function(mails) {
      $scope.mails = mails;
      socket.syncUpdates('mail', $scope.mails, function(event, mail, mails) {
        // sort the array when modified
        mails.sort(function(a, b) {
          a = new Date(a.timestamp);
          b = new Date(b.timestamp);
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    });

    $scope.addThing = function() {
      if($scope.newMail === '') {
        return;
      }
      $http.post('/api/mails', { name: $scope.newMail });
      $scope.newMail = '';
    };

    $scope.deleteThing = function(mail) {
      $http.delete('/api/mails/' + mail._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mail');
    });
  });
