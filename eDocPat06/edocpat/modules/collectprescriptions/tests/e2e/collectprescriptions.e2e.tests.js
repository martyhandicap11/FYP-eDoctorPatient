'use strict';

describe('Collectprescriptions E2E Tests:', function () {
  describe('Test Collectprescriptions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/collectprescriptions');
      expect(element.all(by.repeater('collectprescription in collectprescriptions')).count()).toEqual(0);
    });
  });
});
