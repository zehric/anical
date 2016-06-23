"use strict";
const fs = require('fs');
const airing = require('./airing');
const moment = require('moment');

var cal = function() {
  fs.readFile('./airingtimes.json', 'utf8', function (err, data) {
    if (err && err.code === 'ENOENT') {
      airing().then(cal);
    } else {
      var calendar = {};
      var anime = JSON.parse(data);
      for (let i = -6; i < 7; i++) {
        calendar[moment().add(i, 'days').format('dddd, YYYY-MM-DD')] = [];
      }
      var now = moment();
      for (let name in anime) {
        for (let episode in anime[name]) {
          var time = moment.unix(anime[name][episode]);
          var difference = time.diff(now, 'days');
          if (difference > -6 && difference < 7) {
            calendar[time.format('dddd, YYYY-MM-DD')].push(time.format('hh:mm')
              + ' | ' + name + ' <EP. ' + episode + '>');
          }
        }
      }
      console.log(JSON.stringify(calendar, null, 2)
      .replace(/[\",\\[.*?\]{}]/g, ""));
    }
  });
};
var args = process.argv;
if (args.length > 2 && args[2] === '-r') {
  airing().then(cal);
} else {
  cal();
}
