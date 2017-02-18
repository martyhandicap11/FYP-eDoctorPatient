// Collectprescriptions service used to communicate Collectprescriptions REST endpoints
(function () {
  'use strict';

  angular
    .module('collectprescriptions')
    .factory('CollectprescriptionsService', CollectprescriptionsService);

  CollectprescriptionsService.$inject = ['$resource'];

  function CollectprescriptionsService($resource) {
    return $resource('api/collectprescriptions/:collectprescriptionId', {
      collectprescriptionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
