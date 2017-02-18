(function () {
  'use strict';

  // Collectprescriptions controller
  angular
    .module('collectprescriptions')
    .controller('CollectprescriptionsController', CollectprescriptionsController);

  CollectprescriptionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'collectprescriptionResolve'];

  function CollectprescriptionsController ($scope, $state, $window, Authentication, collectprescription) {
    var vm = this;

    vm.authentication = Authentication;
    vm.collectprescription = collectprescription;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Collectprescription
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.collectprescription.$remove($state.go('collectprescriptions.list'));
      }
    }

    // Save Collectprescription
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.collectprescriptionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.collectprescription._id) {
        vm.collectprescription.$update(successCallback, errorCallback);
      } else {
        vm.collectprescription.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('collectprescriptions.view', {
          collectprescriptionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
