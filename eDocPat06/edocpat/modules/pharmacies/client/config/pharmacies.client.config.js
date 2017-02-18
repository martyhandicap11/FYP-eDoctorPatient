
(function () {
  'use strict';

  angular
    .module('pharmacies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Pharmacies',
      state: 'pharmacies',
      type: 'dropdown',
      roles: ['*']
    });

   
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pharmacies', {
      title: 'Create Pharmacies',
      state: 'pharmacies.create',
      roles: ['user']
    });

     // Add the dropdown list item
     Menus.addSubMenuItem('topbar', 'pharmacies', {
      title: 'List Pharmacies',
      state: 'pharmacies.list'
      
    });

  }
}());
