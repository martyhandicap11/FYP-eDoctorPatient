'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Collectprescription = mongoose.model('Collectprescription'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  collectprescription;

/**
 * Collectprescription routes tests
 */
describe('Collectprescription CRUD tests', function () {

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

    // Save a user to the test db and create new Collectprescription
    user.save(function () {
      collectprescription = {
        name: 'Collectprescription name'
      };

      done();
    });
  });

  it('should be able to save a Collectprescription if logged in', function (done) {
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

        // Save a new Collectprescription
        agent.post('/api/collectprescriptions')
          .send(collectprescription)
          .expect(200)
          .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
            // Handle Collectprescription save error
            if (collectprescriptionSaveErr) {
              return done(collectprescriptionSaveErr);
            }

            // Get a list of Collectprescriptions
            agent.get('/api/collectprescriptions')
              .end(function (collectprescriptionsGetErr, collectprescriptionsGetRes) {
                // Handle Collectprescriptions save error
                if (collectprescriptionsGetErr) {
                  return done(collectprescriptionsGetErr);
                }

                // Get Collectprescriptions list
                var collectprescriptions = collectprescriptionsGetRes.body;

                // Set assertions
                (collectprescriptions[0].user._id).should.equal(userId);
                (collectprescriptions[0].name).should.match('Collectprescription name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Collectprescription if not logged in', function (done) {
    agent.post('/api/collectprescriptions')
      .send(collectprescription)
      .expect(403)
      .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
        // Call the assertion callback
        done(collectprescriptionSaveErr);
      });
  });

  it('should not be able to save an Collectprescription if no name is provided', function (done) {
    // Invalidate name field
    collectprescription.name = '';

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

        // Save a new Collectprescription
        agent.post('/api/collectprescriptions')
          .send(collectprescription)
          .expect(400)
          .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
            // Set message assertion
            (collectprescriptionSaveRes.body.message).should.match('Please fill Collectprescription name');

            // Handle Collectprescription save error
            done(collectprescriptionSaveErr);
          });
      });
  });

  it('should be able to update an Collectprescription if signed in', function (done) {
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

        // Save a new Collectprescription
        agent.post('/api/collectprescriptions')
          .send(collectprescription)
          .expect(200)
          .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
            // Handle Collectprescription save error
            if (collectprescriptionSaveErr) {
              return done(collectprescriptionSaveErr);
            }

            // Update Collectprescription name
            collectprescription.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Collectprescription
            agent.put('/api/collectprescriptions/' + collectprescriptionSaveRes.body._id)
              .send(collectprescription)
              .expect(200)
              .end(function (collectprescriptionUpdateErr, collectprescriptionUpdateRes) {
                // Handle Collectprescription update error
                if (collectprescriptionUpdateErr) {
                  return done(collectprescriptionUpdateErr);
                }

                // Set assertions
                (collectprescriptionUpdateRes.body._id).should.equal(collectprescriptionSaveRes.body._id);
                (collectprescriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Collectprescriptions if not signed in', function (done) {
    // Create new Collectprescription model instance
    var collectprescriptionObj = new Collectprescription(collectprescription);

    // Save the collectprescription
    collectprescriptionObj.save(function () {
      // Request Collectprescriptions
      request(app).get('/api/collectprescriptions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Collectprescription if not signed in', function (done) {
    // Create new Collectprescription model instance
    var collectprescriptionObj = new Collectprescription(collectprescription);

    // Save the Collectprescription
    collectprescriptionObj.save(function () {
      request(app).get('/api/collectprescriptions/' + collectprescriptionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', collectprescription.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Collectprescription with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/collectprescriptions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Collectprescription is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Collectprescription which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Collectprescription
    request(app).get('/api/collectprescriptions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Collectprescription with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Collectprescription if signed in', function (done) {
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

        // Save a new Collectprescription
        agent.post('/api/collectprescriptions')
          .send(collectprescription)
          .expect(200)
          .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
            // Handle Collectprescription save error
            if (collectprescriptionSaveErr) {
              return done(collectprescriptionSaveErr);
            }

            // Delete an existing Collectprescription
            agent.delete('/api/collectprescriptions/' + collectprescriptionSaveRes.body._id)
              .send(collectprescription)
              .expect(200)
              .end(function (collectprescriptionDeleteErr, collectprescriptionDeleteRes) {
                // Handle collectprescription error error
                if (collectprescriptionDeleteErr) {
                  return done(collectprescriptionDeleteErr);
                }

                // Set assertions
                (collectprescriptionDeleteRes.body._id).should.equal(collectprescriptionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Collectprescription if not signed in', function (done) {
    // Set Collectprescription user
    collectprescription.user = user;

    // Create new Collectprescription model instance
    var collectprescriptionObj = new Collectprescription(collectprescription);

    // Save the Collectprescription
    collectprescriptionObj.save(function () {
      // Try deleting Collectprescription
      request(app).delete('/api/collectprescriptions/' + collectprescriptionObj._id)
        .expect(403)
        .end(function (collectprescriptionDeleteErr, collectprescriptionDeleteRes) {
          // Set message assertion
          (collectprescriptionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Collectprescription error error
          done(collectprescriptionDeleteErr);
        });

    });
  });

  it('should be able to get a single Collectprescription that has an orphaned user reference', function (done) {
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

          // Save a new Collectprescription
          agent.post('/api/collectprescriptions')
            .send(collectprescription)
            .expect(200)
            .end(function (collectprescriptionSaveErr, collectprescriptionSaveRes) {
              // Handle Collectprescription save error
              if (collectprescriptionSaveErr) {
                return done(collectprescriptionSaveErr);
              }

              // Set assertions on new Collectprescription
              (collectprescriptionSaveRes.body.name).should.equal(collectprescription.name);
              should.exist(collectprescriptionSaveRes.body.user);
              should.equal(collectprescriptionSaveRes.body.user._id, orphanId);

              // force the Collectprescription to have an orphaned user reference
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

                    // Get the Collectprescription
                    agent.get('/api/collectprescriptions/' + collectprescriptionSaveRes.body._id)
                      .expect(200)
                      .end(function (collectprescriptionInfoErr, collectprescriptionInfoRes) {
                        // Handle Collectprescription error
                        if (collectprescriptionInfoErr) {
                          return done(collectprescriptionInfoErr);
                        }

                        // Set assertions
                        (collectprescriptionInfoRes.body._id).should.equal(collectprescriptionSaveRes.body._id);
                        (collectprescriptionInfoRes.body.name).should.equal(collectprescription.name);
                        should.equal(collectprescriptionInfoRes.body.user, undefined);

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
      Collectprescription.remove().exec(done);
    });
  });
});
