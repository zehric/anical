"use strict"
const rp = require('request-promise')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
// const rl = require('readline-sync')

const SERVER = 'https://anilist.co/api/'
const CLIENT_ID = 'threwqu-o482l'
const SECRET = 'iznV7NsFRZ0EogAP9YMKJMy'

module.exports = function (token) {
  var headers = {}
  headers['Authorization'] = 'Bearer ' + token
  return fs.readFileAsync('animelist.json', 'utf8').bind([])
  .then(function (data) {
    var parsedData = JSON.parse(data)
    var vals = Object.keys(parsedData).map(function (key) {
      return parsedData[key];
    })
    for (let i = 0; i < vals.length; i++) {
      this.push(vals[i])
    }
    return Object.keys(parsedData)
  })
  .map(function (id) {
    var options = {
      uri: SERVER + 'anime/' + id + '/airing',
      headers: headers,
      json: true
    }
    return rp(options)
  })
  .then(function (body) {
    var airingtimes = {}
    for (let i = 0; i < this.length; i++) {
      airingtimes[this[i]] = body[i]
    }
    return fs.writeFileAsync('airingtimes.json',
                             JSON.stringify(airingtimes, null, 2))
  })
  .catch(function (err) {
    console.log(err)
  })
}
