'use strict';

/**
 * Module dependencies
 */
var pharmaciesPolicy = require('../policies/pharmacies.server.policy'),
  pharmacies = require('../controllers/pharmacies.server.controller');

module.exports = function(app) {
  // Pharmacies Routes
  app.route('/api/pharmacies').all(pharmaciesPolicy.isAllowed)
    .get(pharmacies.list)
    .post(pharmacies.create);

  app.route('/api/pharmacies/:pharmacyId').all(pharmaciesPolicy.isAllowed)
    .get(pharmacies.read)
    .put(pharmacies.update)
    .delete(pharmacies.delete);

  // Finish by binding the Pharmacy middleware
  app.param('pharmacyId', pharmacies.pharmacyByID);
};
