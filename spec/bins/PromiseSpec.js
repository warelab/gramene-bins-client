var Q = require('q');
var genomeFixture = require('../support/genomes');
var client = require('gramene-search-client').client.grameneClient;

describe('LatestGenome', function() {

  var binPromiser, expectedResult;

  beforeEach(function() {
    binPromiser = require('../../src/promise');
    expectedResult = Q(genomeFixture);

    spyOn(client, 'then').andReturn(expectedResult);
  });

  it('should return a bin generator', function() {
    // when
    var result = binPromiser.get();
    var iWasCalled = false;

    function checkTheThingReturnedIsTheRightShape(binGenerator) {
      // then
      expect(binGenerator).toBeDefined();
      expect(binGenerator.fixedBinMapper).toBeDefined();
      expect(binGenerator.uniformBinMapper).toBeDefined();
      expect(binGenerator.variableBinMapper).toBeDefined();
      expect(typeof binGenerator.fixedBinMapper).toEqual('function');
      expect(typeof binGenerator.uniformBinMapper).toEqual('function');
      expect(typeof binGenerator.variableBinMapper).toEqual('function');

      return binGenerator;
    }

    function doesReturnedThingAppearToWork(binGenerator) {
      var bins = binGenerator.fixedBinMapper(200);
      iWasCalled = true;
      expect(bins).toBeDefined();
      expect(bins.bin2pos).toBeDefined();
      expect(bins.pos2bin).toBeDefined();
      expect(typeof bins.bin2pos).toEqual('function');
      expect(typeof bins.pos2bin).toEqual('function');
      expect(bins.bin2pos(0)).toBeDefined();
    }

    function thereShouldBeNoErrors(error) {
      expect(error).toBeUndefined();
    }

    function ensureTestResultCalled() {
      return iWasCalled;
    }

    result.then(checkTheThingReturnedIsTheRightShape)
      .then(doesReturnedThingAppearToWork)
      .catch(thereShouldBeNoErrors);

    waitsFor(ensureTestResultCalled, 'the bin generator to be created', 5000);
  });
});