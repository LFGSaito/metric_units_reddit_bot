const should = require('chai').should();

const ch = require('../src/conversion_helper');

describe.only('conversion_helper', () => {
  describe('findPotentialConversions', () => {
    it('should turn feet and inches into feet', () => {
      verifyPotentialConversions(
        [
          "1'2\"",
          "3 foot 4 inches",
          "5ft6in",
          "7-feet-8-in",
          "9' 10.5\"",
          "11'12\"",
          "4,000'0\"" //TODO make this its own test
        ],
        [
          ["1.17", " feet"],
          ["3.33", " feet"],
          ["5.50", " feet"],
          ["7.67", " feet"],
          ["9.88", " feet"],
          ["12.00", " feet"],
          ["4000.00", " feet"],
        ]
      );
    });

    // it('should not convert values that are not feet and inches', () => {
    //   const input = " 12'000 or 2004-'05 ";
    //   preprocess(input).should
    //     .not.include("12.00 feet")
    //     .not.include("4.42 feet");
    // });
  });
});

function verifyPotentialConversions(input, expectedOutput) {
  if (Array.isArray(input)) {
    input = " " + input.join("  ") + " ";
  }

  if (Array.isArray(expectedOutput)) {
    expectedOutput = expectedOutput.reduce((memo, el) => {
      if (Array.isArray(el)) {
        memo.push({
          "inputNumber" : el[0],
          "inputUnit" : el[1]
        });
      }
      return memo;
    }, []);
  }

  ch.findPotentialConversions(input).should.deep.equal(expectedOutput);
}