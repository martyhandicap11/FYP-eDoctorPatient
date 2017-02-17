(function () {
  'use strict';

  // Patients controller
  angular
    .module('patients')
    .controller('PatientsController', PatientsController);

  PatientsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'patientResolve'];

  function PatientsController ($scope, $state, $window, Authentication, Patient ){
    var vm = this;
    

    vm.authentication = Authentication;
    vm.patient = Patient;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;




     //Create new Customer
    $scope.create = function() {
      //Create new Customer Object
      Patient = new Patient ({
          firstname: this.firstname,
          surname: this.surname,
          address1: this.address1,
          address2: this.address2,
          address3: this.address3,
          county: this.county,
          email: this.email,
          phone: this.phone

      });
  };
   
    

    // Remove existing Patient
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.patient.$remove($state.go('patients.list'));
      }
    }

    // Save Patient
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.patientForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.patient._id) {
        vm.patient.$update(successCallback, errorCallback);
      } else {
        vm.patient.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('patients.view', {
          patientId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
