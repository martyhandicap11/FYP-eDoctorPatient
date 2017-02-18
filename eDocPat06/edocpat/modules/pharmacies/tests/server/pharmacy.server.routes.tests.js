'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pharmacy = mongoose.model('Pharmacy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pharmacy;

/**
 * Pharmacy routes tests
 */
describe('Pharmacy CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Pharmacy
    user.save(function () {
      pharmacy = {
        name: 'Pharmacy name'
      };

      done();
    });
  });

  it('should be able to save a Pharmacy if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pharmacy
        agent.post('/api/pharmacies')
          .send(pharmacy)
          .expect(200)
          .end(function (pharmacySaveErr, pharmacySaveRes) {
            // Handle Pharmacy save error
            if (pharmacySaveErr) {
              return done(pharmacySaveErr);
            }

            // Get a list of Pharmacies
            agent.get('/api/pharmacies')
              .end(function (pharmaciesGetErr, pharmaciesGetRes) {
                // Handle Pharmacies save error
                if (pharmaciesGetErr) {
                  return done(pharmaciesGetErr);
                }

                // Get Pharmacies list
                var pharmacies = pharmaciesGetRes.body;

                // Set assertions
                (pharmacies[0].user._id).should.equal(userId);
                (pharmacies[0].name).should.match('Pharmacy name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pharmacy if not logged in', function (done) {
    agent.post('/api/pharmacies')
      .send(pharmacy)
      .expect(403)
      .end(function (pharmacySaveErr, pharmacySaveRes) {
        // Call the assertion callback
        done(pharmacySaveErr);
      });
  });

  it('should not be able to save an Pharmacy if no name is provided', function (done) {
    // Invalidate name field
    pharmacy.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pharmacy
        agent.post('/api/pharmacies')
          .send(pharmacy)
          .expect(400)
          .end(function (pharmacySaveErr, pharmacySaveRes) {
            // Set message assertion
            (pharmacySaveRes.body.message).should.match('Please fill Pharmacy name');

            // Handle Pharmacy save error
            done(pharmacySaveErr);
          });
      });
  });

  it('should be able to update an Pharmacy if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pharmacy
        agent.post('/api/pharmacies')
          .send(pharmacy)
          .expect(200)
          .end(function (pharmacySaveErr, pharmacySaveRes) {
            // Handle Pharmacy save error
            if (pharmacySaveErr) {
              return done(pharmacySaveErr);
            }

            // Update Pharmacy name
            pharmacy.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pharmacy
            agent.put('/api/pharmacies/' + pharmacySaveRes.body._id)
              .send(pharmacy)
              .expect(200)
              .end(function (pharmacyUpdateErr, pharmacyUpdateRes) {
                // Handle Pharmacy update error
                if (pharmacyUpdateErr) {
                  return done(pharmacyUpdateErr);
                }

                // Set assertions
                (pharmacyUpdateRes.body._id).should.equal(pharmacySaveRes.body._id);
                (pharmacyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pharmacies if not signed in', function (done) {
    // Create new Pharmacy model instance
    var pharmacyObj = new Pharmacy(pharmacy);

    // Save the pharmacy
    pharmacyObj.save(function () {
      // Request Pharmacies
      request(app).get('/api/pharmacies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pharmacy if not signed in', function (done) {
    // Create new Pharmacy model instance
    var pharmacyObj = new Pharmacy(pharmacy);

    // Save the Pharmacy
    pharmacyObj.save(function () {
      request(app).get('/api/pharmacies/' + pharmacyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pharmacy.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pharmacy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pharmacies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pharmacy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pharmacy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pharmacy
    request(app).get('/api/pharmacies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pharmacy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pharmacy if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Pharmacy
        agent.post('/api/pharmacies')
          .send(pharmacy)
          .expect(200)
          .end(function (pharmacySaveErr, pharmacySaveRes) {
            // Handle Pharmacy save error
            if (pharmacySaveErr) {
              return done(pharmacySaveErr);
            }

            // Delete an existing Pharmacy
            agent.delete('/api/pharmacies/' + pharmacySaveRes.body._id)
              .send(pharmacy)
              .expect(200)
              .end(function (pharmacyDeleteErr, pharmacyDeleteRes) {
                // Handle pharmacy error error
                if (pharmacyDeleteErr) {
                  return done(pharmacyDeleteErr);
                }

                // Set assertions
                (pharmacyDeleteRes.body._id).should.equal(pharmacySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pharmacy if not signed in', function (done) {
    // Set Pharmacy user
    pharmacy.user = user;

    // Create new Pharmacy model instance
    var pharmacyObj = new Pharmacy(pharmacy);

    // Save the Pharmacy
    pharmacyObj.save(function () {
      // Try deleting Pharmacy
      request(app).delete('/api/pharmacies/' + pharmacyObj._id)
        .expect(403)
        .end(function (pharmacyDeleteErr, pharmacyDeleteRes) {
          // Set message assertion
          (pharmacyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pharmacy error error
          done(pharmacyDeleteErr);
        });

    });
  });

  it('should be able to get a single Pharmacy that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Pharmacy
          agent.post('/api/pharmacies')
            .send(pharmacy)
            .expect(200)
            .end(function (pharmacySaveErr, pharmacySaveRes) {
              // Handle Pharmacy save error
              if (pharmacySaveErr) {
                return done(pharmacySaveErr);
              }

              // Set assertions on new Pharmacy
              (pharmacySaveRes.body.name).should.equal(pharmacy.name);
              should.exist(pharmacySaveRes.body.user);
              should.equal(pharmacySaveRes.body.user._id, orphanId);

              // force the Pharmacy to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Pharmacy
                    agent.get('/api/pharmacies/' + pharmacySaveRes.body._id)
                      .expect(200)
                      .end(function (pharmacyInfoErr, pharmacyInfoRes) {
                        // Handle Pharmacy error
                        if (pharmacyInfoErr) {
                          return done(pharmacyInfoErr);
                        }

                        // Set assertions
                        (pharmacyInfoRes.body._id).should.equal(pharmacySaveRes.body._id);
                        (pharmacyInfoRes.body.name).should.equal(pharmacy.name);
                        should.equal(pharmacyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Pharmacy.remove().exec(done);
    });
  });
});
