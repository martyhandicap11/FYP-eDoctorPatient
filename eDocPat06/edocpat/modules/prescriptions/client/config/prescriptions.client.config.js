
(function () {
  'use strict';

  angular
    .module('prescriptions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Prescriptions',
      state: 'prescriptions',
      type: 'dropdown',
    });

   
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'prescriptions', {
      title: 'Create Prescriptions',
      state: 'prescriptions.create',
      roles: ['user']
    });

     // Add the dropdown list item
     Menus.addSubMenuItem('topbar', 'prescriptions', {
      title: 'List Prescriptions',
      state: 'prescriptions.list'
      
    });

  }
}());
