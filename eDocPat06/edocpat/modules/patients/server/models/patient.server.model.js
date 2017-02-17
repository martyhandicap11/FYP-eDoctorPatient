'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Patient Schema
 */
var PatientSchema = new Schema({
  firstname: {
    type: String,
    default: '',
    trim: true
  },
  surname: {
    type: String,
    default: '',
    trim: true
  },
  address1: {
    type: String,
    default: '',
    trim: true
  },
  address2: {
    type: String,
    default: '',
    trim: true
  },
  address3: {
    type: String,
    default: '',
    trim: true
  },
  county: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
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

mongoose.model('Patient', PatientSchema);