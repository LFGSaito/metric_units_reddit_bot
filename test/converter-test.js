const should = require('chai').should();

const converter = require('../src/converter');

function testConvert(input, expectedMap) {
  if (Array.isArray(input)) {
    input = " " + input.join("  ") + " ";
  }
  comment = {
    'body' : input,
    'subreddit' : 'foo',
    'postTitle' : 'bar'
  }
  converter.conversions(comment).should.deep.equal(expectedMap);
}

function shouldNotConvert(numArr, units) {
  const numUnitArr = numArr.map(num => num + units);
  testConvert(numUnitArr, {})
}

describe('Converter', () => {
  describe('#conversions()', () => {
    context('lbs', () => {
      it('should convert', () => {
        testConvert(
          [
            "1lb",
            "2 lb",
            "3 lbs",
            "4-lbs"
          ],
          {
            "1 lb" : "0.45 kg",
            "2 lb" : "0.9 kg",
            "3 lb" : "1.4 kg",
            "4 lb" : "1.8 kg"
          }
        );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "lb");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "lb");
      });

      it('should not convert units with low confidence', () => {
        shouldNotConvert([22], "pounds")
      });

      context('when confident about one conversion', () => {
        it('should convert those with less confidence', () => {
          testConvert(
            [
              "1 lb",
              "2 pounds",
              "3 pound"
            ],
            {
              "1 lb" : "0.45 kg",
              "2 lb" : "0.9 kg",
              "3 lb" : "1.4 kg"
            }
          );
        }); 
      });
    });

    context('feet', () => {
      it('should convert', () => {
        testConvert(
            [
              "101-feet",
              "20 feet",
              "3 foot",
              "40feet",
              "15.5-ft"
            ],
            {
              "101 ft" : "30 metres",
              "20 ft" : "6 metres",
              "3 ft" : "0.9 metres",
              "40 ft" : "12 metres",
              "15'6\"" : "4.7 metres"
            }
          );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "feet");
      });

      it('should not convert common values', () => {
        shouldNotConvert([1, 2, 4, 6], "feet");
      });

      it('should not convert heights between 4-8ft', () => {
        shouldNotConvert([4.5, 5.7, 6.222, 7.42], "feet");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "feet");
      });

      it('should not convert units with low confidence', () => {
        shouldNotConvert([3], " ft");
        shouldNotConvert([3], "\'");
      });

      context('when confident about one conversion', () => {
        it('should convert those with less confidence', () => {
          testConvert(
            [
              "101-feet",
              "20'",
              "3 ft"
            ],
            {
              "101 ft" : "30 metres",
              "20 ft" : "6 metres",
              "3 ft" : "0.9 metres"
            }
          );
        }); 
      });

      context('and inches', () => {
        it('should convert', () => {
          testConvert(
            [
              "1'2\"",
              "13 foot 4 inches",
              "15ft6in",
              "17-feet-8-in",
              "9' 10.5\"",
              "11'12\"",
              "400'0\""
            ],
            {
             "1'2\"": "0.36 metres",
             "13'4\"": "4 metres",
             "15'6\"": "4.7 metres",
             "17'8\"": "5.4 metres",
             "9'11\"": "3 metres",
             "12 ft": "3.7 metres",
             "400 ft" : "120 metres"
            }
          );
        });

        it('should not convert over 12 inches', () => {
          testConvert("I am 6'13\" tall", { });
        });
      });
    });

    context('inches', () => {
      it('should convert', () => {
        testConvert(
          [
            "1.1-in",
            "2inch",
            "3 inch",
            "40-inch",
            "50 inches"
          ],
          {
           "1.1 inches" : "2.8 cm",
           "2 inches" : "5 cm",
           "3 inches" : "8 cm",
           "40 inches" : "100 cm",
           "50 inches" : "130 cm"
          }
        );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "inches");
      });

      it('should not convert 1 inch', () => {
        shouldNotConvert([1], "inches");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "inches");
      });

      it('should not convert units with low confidence', () => {
        shouldNotConvert([3], " in");
        shouldNotConvert([3], "\'");
      });

      context('when confident about one conversion', () => {
        it('should convert those with less confidence', () => {
          testConvert(
            [
              "1.1-in",
              "3\""
            ],
            {
             "1.1 inches" : "2.8 cm",
             "3 inches" : "8 cm",
            }
          );
        }); 
      });
    });

    context('miles', () => {
      it('should convert', () => {
        testConvert(
          [
            "40miles",
            "50 miles",
            "60 mi",
            "70 mile",
            "80-mile"
          ],
          {
           "40 miles" : "64 km",
           "50 miles" : "80 km",
           "60 miles" : "100 km",
           "70 miles" : "110 km",
           "80 miles" : "130 km"
          }
        );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "miles");
      });

      it('should not convert 1, 8, or 10 miles', () => {
        shouldNotConvert([1, 8, 10], "mile");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "miles");
      });
    });

    context('mph', () => {
      it('should convert', () => {
        testConvert(
          [
            "40mph",
            "50 mph",
            "65 miles per hour",
            "70 miles an hour"
          ],
          {
           "40 mph" : "64 km/h",
           "50 mph" : "80 km/h",
           "65 mph" : "100 km/h",
           "70 mph" : "110 km/h"
          }
        );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "mph");
      });

      it('should not convert common mph', () => {
        shouldNotConvert([1, 10, 60, 88], "mph");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "mph");
      });
    });

    context('mpg', () => {
      it('should convert', () => {
        testConvert(
          [
            "25mpg",
            "30miles per gal",
            "50 miles per gallon"
          ],
          {
           "25 mpg (US)" : "9 L/100km",
           "30 mpg (US)" : "8 L/100km",
           "50 mpg (US)" : "4.7 L/100km"
          }
        );
      });

      it('should not convert zero or negative values', () => {
        shouldNotConvert([0, -10], "mpg");
      });

      it('should not convert less than 10 mpg, since it is likely a delta', () => {
        shouldNotConvert([1, 5, 9.99], "mpg");
      });

      it('should not convert over 235 mpg, because thats ridiculous', () => {
        shouldNotConvert([235], "mpg");
      });

      it('should not convert when values are likely hyperbole', () => {
        shouldNotConvert([100, 1000, 10000], "mph");
      });
    });

    context('°F', () => {
      it('should convert', () => {
        testConvert(
          [
            "-40°f",
            "0°F",
            "32 °F",
            "40 ° F",
            "50 Fahrenheit",
            "60 fahrenheit",
            "70 degree fahrenheit",
            "80 degrees fahrenheit",
            "90 degree f",
            "10000° FAHRENHEIT"
          ],
          {
           "-40°F" : "-40°C",
           "0°F" : "-18°C",
           "32°F" : "0°C",
           "40°F" : "4°C",
           "50°F" : "10°C",
           "60°F" : "16°C",
           "70°F" : "21°C",
           "80°F" : "27°C",
           "90°F" : "32°C",
           "10,000°F" : "5,538°C"
         }
        );
      });
    });

    context('supported special characters', () => {
      it('should convert when starting with special characters', () => {
        testConvert(
          [
            "(-50°F",
            "~-40°F",
            ">0°F",
            "<32°F",
            "\n40°F"
          ],
          {
           "-50°F" : "-46°C",
           "-40°F" : "-40°C",
           "0°F" : "-18°C",
           "32°F" : "0°C",
           "40°F" : "4°C"
         }
        );
      });

      it('should convert when ending with special characters', () => {
        testConvert(
          [
            "-50°F)",
            "-40°F.",
            "0°F,",
            "32°F;",
            "40°F?",
            "50°F!",
            "60°F:",
            "70°F\n",
            "80°F/"
          ],
          {
           "-50°F" : "-46°C",
           "-40°F" : "-40°C",
           "0°F" : "-18°C",
           "32°F" : "0°C",
           "40°F" : "4°C",
           "50°F" : "10°C",
           "60°F" : "16°C",
           "70°F" : "21°C",
           "80°F" : "27°C"
         }
        );
      });

      context('should convert ranges', () => {
        it('starting with special characters', () => {
          testConvert(
            [
              "(-50 to 32°F",
              "~-40 to 32°F",
              ">0 to 32°F",
              "<32 to 0°F",
              "\n40 to 32°F"
            ],
            {
             "-50 to 32°F" : "-46 to 0°C",
             "-40 to 32°F" : "-40 to 0°C",
             "0 to 32°F" : "-18 to 0°C",
             "32 to 0°F" : "0 to -18°C",
             "40 to 32°F" : "4 to 0°C"
           }
          );
        });

        it('ending with special characters', () => {
          testConvert(
            [
              "32 to -50°F)",
              "32 to -40°F.",
              "32 to 0°F,",
              "0 to 32°F;",
              "32 to 40°F?",
              "32 to 50°F!",
              "32 to 60°F:",
              "32 to 70°F\n",
              "32 to 80°F/"
            ],
            {
             "32 to -50°F" : "0 to -46°C",
             "32 to -40°F" : "0 to -40°C",
             "32 to 0°F" : "0 to -18°C",
             "0 to 32°F" : "-18 to 0°C",
             "32 to 40°F" : "0 to 4°C",
             "32 to 50°F" : "0 to 10°C",
             "32 to 60°F" : "0 to 16°C",
             "32 to 70°F" : "0 to 21°C",
             "32 to 80°F" : "0 to 27°C"
           }
          );
        });
      });
    });

    context('large numbers', () => {
      it('should convert with commas', () => {
        testConvert(
          [
            "999,123,456 miles",
            "1000.4 miles"
          ],
          {
           "999,123,456 miles" : "1,600,000,000 km",
           "1,000.4 miles" : "1,600 km"
          }
        );
      });
    });

    context('range', () => {
      it('should convert', () => {
        testConvert(
          [
            "0 - -40°F",
            "5000-9000 miles",
            "30 TO 40 mpg"
          ],
          {
            "0 to -40°F": "-18 to -40°C",
            "5,000 to 9,000 miles" : "8,000 to 14,000 km",
            "30 to 40 mpg (US)": "8 to 6 L/100km"
          }
        );
      });

      it('should collapse ranges if needed', () => {
        testConvert("100-101 degrees F", { "100 to 101°F" : "38°C" });
      });
    });

    context('nothing to convert', () => {
      it('should not convert', () => {
        const inputString = [
          "some miles",
          "50",
          "90km",
          "1,10,2 miles",
          "a22°Fb",
          "a 22°Fb",
          "a22°F b",
          "a22°Fb",
          "22F"
        ].join("  ");

        testConvert(inputString, { });
      });
    });

    context('should not convert if conversion is already calculated', () => {
      it('should not convert a value that has been converted', () => {
        testConvert(
          [
            "101°F",
            "101-200°F"
          ],
          {
            "101 to 200°F" : "38 to 93°C"
          }
        );
      });

      it('converts ranges but not single of the same units, if it is the last one', () => {
        testConvert(
          [
            "200°F",
            "101-200°F"
          ],
          {
            "101 to 200°F" : "38 to 93°C"
          }
        );
      });

      it('converts ranges but not single of the same units, if it is the last one', () => {
        testConvert(
          [
            "200 miles",
            "101-200°F"
          ],
          {
            "101 to 200°F" : "38 to 93°C",
            "200 miles" : "320 km"
          }
        );
      });

      it('should resolve all equivalent conversions to one outcome', () => {
        testConvert(
          [
            "200 miles",
            "200mi",
          ],
          {
            "200 miles" : "320 km"
          }
        );
      });
    });

    context('comment contains quote', () => {
      it('should not convert', () => {
        testConvert("> About 201 miles away", {});
        testConvert(">1.5lbs", {});
        testConvert("\n&gt; About 202 miles away", {});
      });
    });

    context('comment already contains conversion', () => {
      it('should not convert', () => {
        testConvert("About 200 miles (320 km) away", {});
        //Story #150138193
        // testConvert("About 200 miles or 300 kilometers away", {});
        // testConvert("About 200 miles or 322 away", {});
        // testConvert("About 200 miles or 321.9 away", {});
        // testConvert("About 200 miles or 321.87 away", {});
        // testConvert("About 200 miles or 321.879 away", {});
      });
    });

    context('ignored keywords', () => {
      it('should not convert if the sub name matches exclusion', () => {
        const comment = {
          'body' : 'He played 30mpg',
          'subreddit' : 'basketball4lyfe',
          'postTitle' : 'bar'
        }
        converter.conversions(comment).should.deep.equal({});
      });
      
      it('should not convert if the post title matches exclusion', () => {
        const comment = {
          'body' : 'He played 30mpg',
          'subreddit' : 'foo',
          'postTitle' : 'this is basketball talk'
        }
        converter.conversions(comment).should.deep.equal({});
      });
      
      it('should not convert if the body matches, case-insensitive', () => {
        testConvert("My 32 inch ultra widescreen MONITOR", {});
      });

      it('should not convert if keyword is not found', () => {
        testConvert("10 inches of grassy hills", {"10 inches" : "25 cm"})
      });
    })

    context('high confidence conversion with low confidence conversion', () => {
      it('should trigger regardless of hyperbole', () => {
        testConvert("1000' wide and 2000 feet across", {
          "1,000 ft" : "300 metres",
          "2,000 ft" : "600 metres"
        });
      });
      
      it('should trigger regardless even if it is a different unit', () => {
        testConvert("1000' wide and 2000 miles across", {
          "1,000 ft" : "300 metres",
          "2,000 miles" : "3,200 km"
        });
      });
    });

    context.skip('Current failing tests - bugs and edge cases', () => {
      //Story #150577140
      context('high confidence conversion with low confidence conversion', () => {
        it('should not convert negatives', () => {
          testConvert("-1000' wide and 2000 feet across", {
            "1,000 ft" : "305 metres",
            "2,000 ft" : "610 metres"
          });
        });

        it('should trigger regardless of keywords', () => {
          testConvert("1000 mi wide and 2000 miles across italy", {
            "1,000 miles" : "1,609 km",
            "2,000 miles" : "3,219 km"
          });
        });

        it('should trigger regardless of keywords', () => {
          testConvert("1000 mi wide and 2000 foot across italy", {
            "1,000 miles" : "1,609 km",
            "2,000 ft" : "610 metres"
          });
        });
      });

      //Story #150482058
      it('should display partial inches', () => {
        testConvert("9 feet 10.5", { "9'10.5\"": "3.01 metres" });
      });

      // Story #150138193
      context('comment already contains conversion', () => {
        it('should not convert regardless of commas', () => {
          testConvert("About 2000 miles or 3219 kilometers away", {});
        });

        it('should be smart enough to handle rounding', () => {
          testConvert("About 2000 miles or 3,220 kilometers away", {});
        });

        it('should convert if the units do not match', () => {
          testConvert("About 200 miles and 322 degrees C away", {"200 miles" : "322 km"});
        });

        it('should convert if the value does not exactly match', () => {
          testConvert("About 200 miles and 32222 km  away", {"200 miles" : "322 km"});
        });
      });
    });
  });
});