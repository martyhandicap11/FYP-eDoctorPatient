'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pharmacy Schema
 */
var PharmacySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pharmacy name',
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

mongoose.model('Pharmacy', PharmacySchema);
