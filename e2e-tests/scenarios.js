'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /bb when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/bb");
  });


  describe('bb', function() {

    beforeEach(function() {
      browser.get('index.html#/bb');
    });


    it('should render bb when user navigates to /bb', function() {
      expect(element(by.css('#search-location'))).toBeDefined();
      expect(element(by.css('#define-period'))).toBeDefined();
      expect(element(by.css('#search-slot'))).toBeDefined();
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
