//
// UTC Date/Time and Time-zone:
//
//           1        2 3    4   5  6
//           |        | |    |   |  |
//  $--ZDA,hhmmss.ss,xx,xx,xxxx,xx,xx*h
// ------------------------------------------------------------------------------
//
// 1) Hours, Minutes, Seconds, and hundreds of seconds (UTC).
// 2) Day number 01 to 31
// 3) Month number 01 to 12
// 4) Year
// 5) Local time zone offset 0 to +/- 13 hours
// 6) Local zone minutes
//
// Example data: $INZDA,142221.93,11,12,2023,04,00*7E
//               $INZDA,121929.00,11,07,2022,-02,00*5C

const nmea = require('../nmea.js')
module.exports = function (app) {
  return {
    title: 'ZDA - UTC date/time and time-zone',
    keys: ['navigation.datetime', 'environment.time'],
    defaults: [null, null],
    f: function (datetime8601, timeZone) {
      // app.debug(`ZDA: ${datetime8601} '${timeZone}'   type=${typeof timeZone}.`);
      const datetime = new Date(datetime8601);
      const hours = ('00' + datetime.getUTCHours()).slice(-2);
      const minutes = ('00' + datetime.getUTCMinutes()).slice(-2);
      const seconds = ('00' + datetime.getUTCSeconds()).slice(-2);
      const hundredsOfSeconds = Math.round(datetime.getUTCMilliseconds() / 10).toString().padStart(2, '0');
      const day = ('00' + datetime.getUTCDate()).slice(-2);
      const month = ('00' + (datetime.getUTCMonth() + 1)).slice(-2);

      let tzHours = '';
      let tzMinutes = '';

      // Assume that the 'environment.time' uses a 'UTC+02:00' format.
      if (timeZone && typeof timeZone === 'string') {
        if (timeZone.length === 9 && timeZone.startsWith('UTC')) {
          const hourValue = parseInt(timeZone.substring(3, 6), 10);
          tzHours = hourValue < 0 ? '-' + Math.abs(hourValue).toString().padStart(2, '0') : hourValue.toString().padStart(2, '0');
          tzMinutes = parseInt(timeZone.substring(7, 9), 10).toString().padStart(2, '0');
        }
        else {
          app.debug(`Unexpected time-zone format: '${timeZone}'.`);
        }
      }

      return nmea.toSentence([
        '$IIZDA',
        hours + minutes + seconds + '.' + hundredsOfSeconds,
        day,
        month,
        datetime.getUTCFullYear(),
        tzHours,
        tzMinutes
      ]);
    }
  };
}
