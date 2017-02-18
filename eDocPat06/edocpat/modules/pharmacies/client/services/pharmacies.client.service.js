// Pharmacies service used to communicate Pharmacies REST endpoints
(function () {
  'use strict';

  angular
    .module('pharmacies')
    .factory('PharmaciesService', PharmaciesService);

  PharmaciesService.$inject = ['$resource'];

  function PharmaciesService($resource) {
    return $resource('api/pharmacies/:pharmacyId', {
      pharmacyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
