//
// MWD - Wind Direction and Speed
//
//         1  2  3  4  5  6  7  8 9
//         |  |  |  |  |  |  |  | |
// $--MWD,x.x,T,x.x,M,x.x,N,x.x,M*hh
//
// Field Number: 
//
// 1. Wind Direction True (0° to 359°)
// 2. T
// 3. Wind Direction Magnetic (0° to 359°)
// 4. M
// 5. Wind Speed (knots)
// 6. N
// 7. Wind Speed (m/s)
// 8. M
// 9. Checksum
//
// Example data: $INMWD,52.7,T,,M,3.5,N,1.8,M*52
//

const nmea = require('../nmea.js')
module.exports = function (app) {
  return {
    sentence: 'MWD',
    title: 'MWD - Wind direction (only True, no Magnetic direction) and wind speed.',
    keys: [
      'environment.wind.directionTrue',
      'environment.wind.speedTrue'
    ],
    f: function (directionTrue, speedTrue) {
      return nmea.toSentence([
        '$IIMWD',
        nmea.radsToDeg(directionTrue).toFixed(2),
        'T',
        '', // No value for Wind Direction Magnetic.
        'M',
        nmea.msToKnots(speedTrue).toFixed(2),
        'N',
        speedTrue.toFixed(2),
        'M'
      ])
    }
  }
}
