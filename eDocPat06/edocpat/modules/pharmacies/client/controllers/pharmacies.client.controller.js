(function () {
  'use strict';

  // Pharmacies controller
  angular
    .module('pharmacies')
    .controller('PharmaciesController', PharmaciesController);

  PharmaciesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pharmacyResolve'];

  function PharmaciesController ($scope, $state, $window, Authentication, pharmacy) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pharmacy = pharmacy;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pharmacy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pharmacy.$remove($state.go('pharmacies.list'));
      }
    }

    // Save Pharmacy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pharmacyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pharmacy._id) {
        vm.pharmacy.$update(successCallback, errorCallback);
      } else {
        vm.pharmacy.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pharmacies.view', {
          pharmacyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
