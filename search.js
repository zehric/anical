"use strict"
const rp = require('request-promise')
const Promise = require('bluebird')

const SERVER = 'https://anilist.co/api/'
const CLIENT_ID = 'threwqu-o482l'
const SECRET = 'iznV7NsFRZ0EogAP9YMKJMy'

var TOKEN = ''
var TERM = ''
var animelist = {}

function getAccessToken(token) {
  var tokenOptions = {
    uri: SERVER + 'auth/access_token?grant_type=client_credentials&client_id='
    + CLIENT_ID + '&client_secret=' + SECRET,
    json: true
  }
  return rp.post(tokenOptions)
  .then(function (body) {
    TOKEN = body.access_token
    token[0] = TOKEN
  })
}

var dummyPromise = Promise.promisify(JSON.parse)

function main() {
  var headers = {}
  headers['Authorization'] = 'Bearer ' + TOKEN
  var options = {
    uri: SERVER + 'anime/search/' + TERM,
    headers: headers,
    json: true
  }
  return rp(options)
}

module.exports.go = function (term, token) {
  TERM = term
  if (!token.length) {
    return getAccessToken(token).then(main)
  } else {
    TOKEN = token[0]
    return dummyPromise('{}').then(main)
  }
}

module.exports.accessToken = getAccessToken

