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
  // .map(function (name) {
  //   name = encodeURIComponent(name)
  //   var options = {
  //     uri: SERVER + 'anime/search/' + name,
  //     headers: headers,
  //     json: true
  //   }
  //   return rp(options)
  // }).bind([])
  // .map(function (body) {
  //   var index = 0
  //   if (body.length > 1) {
  //     index = -1
  //     for (let i = 0; i < body.length; i++) {
  //       console.log((i + 1) + '. ' + body[i].title_romaji
  //                   + ' (' + body[i].type + ')')
  //     }
  //     while (index < 0 || index >= body.length) {
  //       index = rl.question('Which anime? ') - 1
  //     }
  //   }
  //   this.push(body[index].title_romaji)
  //   return body[index].id
  // })
  .map(function (id) {
    var options = {
      uri: SERVER + 'anime/' + id + '/airing',
      headers: headers,
      json: true
    }
    return rp(options)
  })
  .then(function (body) {
    console.log(JSON.stringify(body, null, 2))
    console.log(this)
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
