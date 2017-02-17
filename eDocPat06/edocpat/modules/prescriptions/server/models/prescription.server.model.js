'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Prescription Schema
 */
var PrescriptionSchema = new Schema({
  dr_firstname: {
    type: String,
    default: '',
    trim: true
  },
  dr_lastname: {
    type: String,
    default: '',
    trim: true
  },
  address01: {
    type: String,
    default: '',
    trim: true
  },
  address02: {
    type: String,
    default: '',
    trim: true
  },
  town: {
    type: String,
    default: '',
    trim: true
  },
  medicine: {
    type: String,
    default: '',
    trim: true
  },
  amount: {
    type: String,
    default: '',
    trim: true
  },
  treatment: {
    type: String,
    default: '',
    trim: true
  },
  signature: {
    type: String,
    default: '',
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

mongoose.model('Prescription', PrescriptionSchema);
