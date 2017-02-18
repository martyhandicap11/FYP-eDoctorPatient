(function () {
  'use strict';

  angular
    .module('pharmacies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pharmacies', {
        abstract: true,
        url: '/pharmacies',
        template: '<ui-view/>'
      })
      .state('pharmacies.list', {
        url: '',
        templateUrl: 'modules/pharmacies/client/views/list-pharmacies.client.view.html',
        controller: 'PharmaciesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pharmacies List'
        }
      })
      .state('pharmacies.create', {
        url: '/create',
        templateUrl: 'modules/pharmacies/client/views/form-pharmacy.client.view.html',
        controller: 'PharmaciesController',
        controllerAs: 'vm',
        resolve: {
          pharmacyResolve: newPharmacy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pharmacies Create'
        }
      })
      .state('pharmacies.edit', {
        url: '/:pharmacyId/edit',
        templateUrl: 'modules/pharmacies/client/views/form-pharmacy.client.view.html',
        controller: 'PharmaciesController',
        controllerAs: 'vm',
        resolve: {
          pharmacyResolve: getPharmacy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pharmacy {{ pharmacyResolve.name }}'
        }
      })
      .state('pharmacies.view', {
        url: '/:pharmacyId',
        templateUrl: 'modules/pharmacies/client/views/view-pharmacy.client.view.html',
        controller: 'PharmaciesController',
        controllerAs: 'vm',
        resolve: {
          pharmacyResolve: getPharmacy
        },
        data: {
          pageTitle: 'Pharmacy {{ pharmacyResolve.name }}'
        }
      });
  }

  getPharmacy.$inject = ['$stateParams', 'PharmaciesService'];

  function getPharmacy($stateParams, PharmaciesService) {
    return PharmaciesService.get({
      pharmacyId: $stateParams.pharmacyId
    }).$promise;
  }

  newPharmacy.$inject = ['PharmaciesService'];

  function newPharmacy(PharmaciesService) {
    return new PharmaciesService();
  }
}());
