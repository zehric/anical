"use strict"
const fs = require('fs')
const moment = require('moment')

var cal = function(callback) {
  fs.readFile('./airingtimes.json', 'utf8', function (err, data) {
    if (err && err.code === 'ENOENT') {
      callback('You have to add some anime first!')
    } else {
      var calendar = {}
      var anime = JSON.parse(data)
      for (let i = -7; i < 7; i++) {
        calendar[moment().add(i, 'days').format('dddd, YYYY-MM-DD')] = []
      }
      var now = moment()
      for (let name in anime) {
        for (let episode in anime[name]) {
          var time = moment.unix(anime[name][episode])
          var difference = time.diff(now, 'days')
          if (difference > -6 && difference < 6) {
            calendar[time.format('dddd, YYYY-MM-DD')].push(time.format('hh:mm')
              + ' | ' + name + ' <EP. ' + episode + '>')
          }
        }
      }
      // callback(calendar)
      callback(JSON.stringify(calendar, null, 2)
      .replace(/[\",\\[.*?\]{}]/g, ""))
    }
  })
}
module.exports = cal;
