(function () {
  'use strict';

  describe('Collectprescriptions Route Tests', function () {
    // Initialize global variables
    var $scope,
      CollectprescriptionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CollectprescriptionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CollectprescriptionsService = _CollectprescriptionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('collectprescriptions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/collectprescriptions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CollectprescriptionsController,
          mockCollectprescription;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('collectprescriptions.view');
          $templateCache.put('modules/collectprescriptions/client/views/view-collectprescription.client.view.html', '');

          // create mock Collectprescription
          mockCollectprescription = new CollectprescriptionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collectprescription Name'
          });

          // Initialize Controller
          CollectprescriptionsController = $controller('CollectprescriptionsController as vm', {
            $scope: $scope,
            collectprescriptionResolve: mockCollectprescription
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:collectprescriptionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.collectprescriptionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            collectprescriptionId: 1
          })).toEqual('/collectprescriptions/1');
        }));

        it('should attach an Collectprescription to the controller scope', function () {
          expect($scope.vm.collectprescription._id).toBe(mockCollectprescription._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/collectprescriptions/client/views/view-collectprescription.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CollectprescriptionsController,
          mockCollectprescription;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('collectprescriptions.create');
          $templateCache.put('modules/collectprescriptions/client/views/form-collectprescription.client.view.html', '');

          // create mock Collectprescription
          mockCollectprescription = new CollectprescriptionsService();

          // Initialize Controller
          CollectprescriptionsController = $controller('CollectprescriptionsController as vm', {
            $scope: $scope,
            collectprescriptionResolve: mockCollectprescription
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.collectprescriptionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/collectprescriptions/create');
        }));

        it('should attach an Collectprescription to the controller scope', function () {
          expect($scope.vm.collectprescription._id).toBe(mockCollectprescription._id);
          expect($scope.vm.collectprescription._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/collectprescriptions/client/views/form-collectprescription.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CollectprescriptionsController,
          mockCollectprescription;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('collectprescriptions.edit');
          $templateCache.put('modules/collectprescriptions/client/views/form-collectprescription.client.view.html', '');

          // create mock Collectprescription
          mockCollectprescription = new CollectprescriptionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Collectprescription Name'
          });

          // Initialize Controller
          CollectprescriptionsController = $controller('CollectprescriptionsController as vm', {
            $scope: $scope,
            collectprescriptionResolve: mockCollectprescription
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:collectprescriptionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.collectprescriptionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            collectprescriptionId: 1
          })).toEqual('/collectprescriptions/1/edit');
        }));

        it('should attach an Collectprescription to the controller scope', function () {
          expect($scope.vm.collectprescription._id).toBe(mockCollectprescription._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/collectprescriptions/client/views/form-collectprescription.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
