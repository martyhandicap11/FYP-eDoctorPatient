(function () {
  'use strict';

  describe('Collectprescriptions Controller Tests', function () {
    // Initialize global variables
    var CollectprescriptionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CollectprescriptionsService,
      mockCollectprescription;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CollectprescriptionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CollectprescriptionsService = _CollectprescriptionsService_;

      // create mock Collectprescription
      mockCollectprescription = new CollectprescriptionsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Collectprescription Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Collectprescriptions controller.
      CollectprescriptionsController = $controller('CollectprescriptionsController as vm', {
        $scope: $scope,
        collectprescriptionResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCollectprescriptionPostData;

      beforeEach(function () {
        // Create a sample Collectprescription object
        sampleCollectprescriptionPostData = new CollectprescriptionsService({
          name: 'Collectprescription Name'
        });

        $scope.vm.collectprescription = sampleCollectprescriptionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CollectprescriptionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/collectprescriptions', sampleCollectprescriptionPostData).respond(mockCollectprescription);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Collectprescription was created
        expect($state.go).toHaveBeenCalledWith('collectprescriptions.view', {
          collectprescriptionId: mockCollectprescription._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/collectprescriptions', sampleCollectprescriptionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Collectprescription in $scope
        $scope.vm.collectprescription = mockCollectprescription;
      });

      it('should update a valid Collectprescription', inject(function (CollectprescriptionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/collectprescriptions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('collectprescriptions.view', {
          collectprescriptionId: mockCollectprescription._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CollectprescriptionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/collectprescriptions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Collectprescriptions
        $scope.vm.collectprescription = mockCollectprescription;
      });

      it('should delete the Collectprescription and redirect to Collectprescriptions', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/collectprescriptions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('collectprescriptions.list');
      });

      it('should should not delete the Collectprescription and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
