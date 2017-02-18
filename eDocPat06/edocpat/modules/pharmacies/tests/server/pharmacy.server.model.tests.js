'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pharmacy = mongoose.model('Pharmacy');

/**
 * Globals
 */
var user,
  pharmacy;

/**
 * Unit tests
 */
describe('Pharmacy Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      pharmacy = new Pharmacy({
        name: 'Pharmacy Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return pharmacy.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      pharmacy.name = '';

      return pharmacy.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Pharmacy.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
