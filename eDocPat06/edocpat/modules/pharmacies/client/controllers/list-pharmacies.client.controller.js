(function () {
  'use strict';

  angular
    .module('pharmacies')
    .controller('PharmaciesListController', PharmaciesListController);

  PharmaciesListController.$inject = ['PharmaciesService'];

  function PharmaciesListController(PharmaciesService) {
    var vm = this;

    vm.pharmacies = PharmaciesService.query();
  }
}());
