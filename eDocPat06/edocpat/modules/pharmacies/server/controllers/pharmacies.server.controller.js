'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pharmacy = mongoose.model('Pharmacy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pharmacy
 */
exports.create = function(req, res) {
  var pharmacy = new Pharmacy(req.body);
  pharmacy.user = req.user;

  pharmacy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pharmacy);
    }
  });
};

/**
 * Show the current Pharmacy
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pharmacy = req.pharmacy ? req.pharmacy.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pharmacy.isCurrentUserOwner = req.user && pharmacy.user && pharmacy.user._id.toString() === req.user._id.toString();

  res.jsonp(pharmacy);
};

/**
 * Update a Pharmacy
 */
exports.update = function(req, res) {
  var pharmacy = req.pharmacy;

  pharmacy = _.extend(pharmacy, req.body);

  pharmacy.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pharmacy);
    }
  });
};

/**
 * Delete an Pharmacy
 */
exports.delete = function(req, res) {
  var pharmacy = req.pharmacy;

  pharmacy.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pharmacy);
    }
  });
};

/**
 * List of Pharmacies
 */
exports.list = function(req, res) {
  Pharmacy.find().sort('-created').populate('user', 'displayName').exec(function(err, pharmacies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pharmacies);
    }
  });
};

/**
 * Pharmacy middleware
 */
exports.pharmacyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pharmacy is invalid'
    });
  }

  Pharmacy.findById(id).populate('user', 'displayName').exec(function (err, pharmacy) {
    if (err) {
      return next(err);
    } else if (!pharmacy) {
      return res.status(404).send({
        message: 'No Pharmacy with that identifier has been found'
      });
    }
    req.pharmacy = pharmacy;
    next();
  });
};
