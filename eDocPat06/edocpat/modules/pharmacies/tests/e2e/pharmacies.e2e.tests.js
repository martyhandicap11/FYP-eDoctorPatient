'use strict';

describe('Pharmacies E2E Tests:', function () {
  describe('Test Pharmacies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pharmacies');
      expect(element.all(by.repeater('pharmacy in pharmacies')).count()).toEqual(0);
    });
  });
});
