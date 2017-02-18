(function () {
  'use strict';

  angular
    .module('collectprescriptions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('collectprescriptions', {
        abstract: true,
        url: '/collectprescriptions',
        template: '<ui-view/>'
      })
      .state('collectprescriptions.list', {
        url: '',
        templateUrl: 'modules/collectprescriptions/client/views/list-collectprescriptions.client.view.html',
        controller: 'CollectprescriptionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Collectprescriptions List'
          
        }
      })
      .state('collectprescriptions.create', {
        url: '/create',
        templateUrl: 'modules/collectprescriptions/client/views/form-collectprescription.client.view.html',
        controller: 'CollectprescriptionsController',
        controllerAs: 'vm',
        resolve: {
          collectprescriptionResolve: newCollectprescription
        },
        data: {
          roles: ['user','admin'],
          pageTitle: 'Collectprescriptions Create'
        }
      })
      .state('collectprescriptions.edit', {
        url: '/:collectprescriptionId/edit',
        templateUrl: 'modules/collectprescriptions/client/views/form-collectprescription.client.view.html',
        controller: 'CollectprescriptionsController',
        controllerAs: 'vm',
        resolve: {
          collectprescriptionResolve: getCollectprescription
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Collectprescription {{ collectprescriptionResolve.name }}'
        }
      })
      .state('collectprescriptions.view', {
        url: '/:collectprescriptionId',
        templateUrl: 'modules/collectprescriptions/client/views/view-collectprescription.client.view.html',
        controller: 'CollectprescriptionsController',
        controllerAs: 'vm',
        resolve: {
          collectprescriptionResolve: getCollectprescription
        },
        data: {
          pageTitle: 'Collectprescription {{ collectprescriptionResolve.name }}'
        }
      });
  }

  getCollectprescription.$inject = ['$stateParams', 'CollectprescriptionsService'];

  function getCollectprescription($stateParams, CollectprescriptionsService) {
    return CollectprescriptionsService.get({
      collectprescriptionId: $stateParams.collectprescriptionId
    }).$promise;
  }

  newCollectprescription.$inject = ['CollectprescriptionsService'];

  function newCollectprescription(CollectprescriptionsService) {
    return new CollectprescriptionsService();
  }
}());
