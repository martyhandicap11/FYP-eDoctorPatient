'use strict';

/**
 * Module dependencies
 */
var collectprescriptionsPolicy = require('../policies/collectprescriptions.server.policy'),
  collectprescriptions = require('../controllers/collectprescriptions.server.controller');

module.exports = function(app) {
  // Collectprescriptions Routes
  app.route('/api/collectprescriptions').all(collectprescriptionsPolicy.isAllowed)
    .get(collectprescriptions.list)
    .post(collectprescriptions.create);

  app.route('/api/collectprescriptions/:collectprescriptionId').all(collectprescriptionsPolicy.isAllowed)
    .get(collectprescriptions.read)
    .put(collectprescriptions.update)
    .delete(collectprescriptions.delete);

  // Finish by binding the Collectprescription middleware
  app.param('collectprescriptionId', collectprescriptions.collectprescriptionByID);
};
