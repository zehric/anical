"use strict";
const rp = require('request-promise');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const rl = require('readline-sync');

const SERVER = 'https://anilist.co/api/';
const CLIENT_ID = 'threwqu-o482l';
const SECRET = 'iznV7NsFRZ0EogAP9YMKJMy';

module.exports = function () {
  var headers = {};
  var tokenOptions = {
    uri: SERVER + 'auth/access_token?grant_type=client_credentials&client_id='
         + CLIENT_ID + '&client_secret=' + SECRET,
    json: true
  };
  return rp.post(tokenOptions)
  .then(function (body) {
    headers['Authorization'] = 'Bearer ' + body.access_token;
    return fs.readFileAsync('animelist.txt', 'utf8');
  })
  .then(function (data) {
    return data.trim().split('\n');
  })
  .map(function (name) {
    name = encodeURIComponent(name);
    var options = {
      uri: SERVER + 'anime/search/' + name,
      headers: headers,
      json: true
    };
    return rp(options);
  }).bind([])
  .map(function (body) {
    var index = 0;
    if (body.length > 1) {
      index = -1;
      for (let i = 0; i < body.length; i++) {
        console.log((i + 1) + '. ' + body[i].title_romaji
                    + ' (' + body[i].type + ')');
      }
      while (index < 0 || index >= body.length) {
        index = rl.question('Which anime? ') - 1;
      }
    }
    this.push(body[index].title_romaji);
    return body[index].id;
  })
  .map(function (id) {
    var options = {
      uri: SERVER + 'anime/' + id + '/airing',
      headers: headers,
      json: true
    };
    return rp(options);
  })
  .then(function (body) {
    var airingtimes = {};
    for (let i = 0; i < this.length; i++) {
      airingtimes[this[i]] = body[i];
    }
    return fs.writeFileAsync('airingtimes.json',
                             JSON.stringify(airingtimes, null, 2));
  })
  .catch(function (err) {
    console.log(err);
  });
};
