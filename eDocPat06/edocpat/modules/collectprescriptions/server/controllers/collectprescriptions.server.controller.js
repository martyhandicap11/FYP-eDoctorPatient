'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Collectprescription = mongoose.model('Collectprescription'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Collectprescription
 */
exports.create = function(req, res) {
  var collectprescription = new Collectprescription(req.body);
  collectprescription.user = req.user;

  collectprescription.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectprescription);
    }
  });
};

/**
 * Show the current Collectprescription
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var collectprescription = req.collectprescription ? req.collectprescription.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  collectprescription.isCurrentUserOwner = req.user && collectprescription.user && collectprescription.user._id.toString() === req.user._id.toString();

  res.jsonp(collectprescription);
};

/**
 * Update a Collectprescription
 */
exports.update = function(req, res) {
  var collectprescription = req.collectprescription;

  collectprescription = _.extend(collectprescription, req.body);

  collectprescription.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectprescription);
    }
  });
};

/**
 * Delete an Collectprescription
 */
exports.delete = function(req, res) {
  var collectprescription = req.collectprescription;

  collectprescription.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectprescription);
    }
  });
};

/**
 * List of Collectprescriptions
 */
exports.list = function(req, res) {
  Collectprescription.find().sort('-created').populate('user', 'displayName').exec(function(err, collectprescriptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(collectprescriptions);
    }
  });
};

/**
 * Collectprescription middleware
 */
exports.collectprescriptionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Collectprescription is invalid'
    });
  }

  Collectprescription.findById(id).populate('user', 'displayName').exec(function (err, collectprescription) {
    if (err) {
      return next(err);
    } else if (!collectprescription) {
      return res.status(404).send({
        message: 'No Collectprescription with that identifier has been found'
      });
    }
    req.collectprescription = collectprescription;
    next();
  });
};
