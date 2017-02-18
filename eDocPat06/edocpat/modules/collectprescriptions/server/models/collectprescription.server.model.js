'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collectprescription Schema
 */
var CollectprescriptionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Collectprescription name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Collectprescription', CollectprescriptionSchema);
