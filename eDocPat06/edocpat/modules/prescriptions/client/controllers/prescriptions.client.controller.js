(function () {
  'use strict';

  // Prescriptions controller
  angular
    .module('prescriptions')
    .controller('PrescriptionsController', PrescriptionsController);

  PrescriptionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'prescriptionResolve'];

  function PrescriptionsController ($scope, $state, $window, Authentication, Prescription) {
    var vm = this;

    vm.authentication = Authentication;
    vm.prescription = Prescription;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //Create New Prescription
    $scope.create = function()
    {
      //Create new Prescription Object
      Prescription = new Prescription
      ({
         dr_firstname:this.dr_firstname,
         dr_lastname:this.dr_lastname,
         address01:this.address01,
         address02:this.address02,
         town:this.town,
         medicine:this.medicine,
         amount:this.amount,
         treatment:this.treatment,
         signature:this.signature
      });

    };



    // Remove existing Prescription
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.prescription.$remove($state.go('prescriptions.list'));
      }
    }

    // Save Prescription
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.prescriptionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.prescription._id) {
        vm.prescription.$update(successCallback, errorCallback);
      } else {
        vm.prescription.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('prescriptions.view', {
          prescriptionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
