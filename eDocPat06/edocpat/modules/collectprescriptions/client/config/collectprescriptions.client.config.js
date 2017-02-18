
(function () {
  'use strict';

  angular
    .module('collectprescriptions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Collectprescriptions',
      state: 'collectprescriptions',
      type: 'dropdown',
      roles: ['*']
    });

   
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'collectprescriptions', {
      title: 'Create Collectprescriptions',
      state: 'collectprescriptions.create',
      roles: ['user']
    });

     // Add the dropdown list item
     Menus.addSubMenuItem('topbar', 'collectprescriptions', {
      title: 'List Collectprescriptions',
      state: 'collectprescriptions.list'
      
    });



  }
}());
