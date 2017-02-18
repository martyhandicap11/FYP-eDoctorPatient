(function () {
  'use strict';

  angular
    .module('collectprescriptions')
    .controller('CollectprescriptionsListController', CollectprescriptionsListController);

  CollectprescriptionsListController.$inject = ['CollectprescriptionsService'];

  function CollectprescriptionsListController(CollectprescriptionsService) {
    var vm = this;

    vm.collectprescriptions = CollectprescriptionsService.query();
  }
}());
