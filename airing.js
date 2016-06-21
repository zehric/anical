"use strict";
const rp = require('request-promise');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const rl = require('readline-sync');

const SERVER = 'https://anilist.co/api/';
const CLIENT_ID = 'threwqu-o482l';
const SECRET = 'iznV7NsFRZ0EogAP9YMKJMy';

var accessToken = function () {
  var options = {
    uri: SERVER + 'auth/access_token?grant_type=client_credentials&client_id='
         + CLIENT_ID + '&client_secret=' + SECRET,
    json: true
  };
  rp.post(options)
  .then(function (body) {
    return fs.writeFileAsync('token', body.access_token);
  })
  .catch(function (err) {
    console.log(err);
  });
  exports.mkair();
};

var handle = function (err) {
  if (err.code === 'ENOENT' || err.statusCode == 401) {
    accessToken();
  } else {
    console.log(err);
  }
};

module.exports.mkair = function () {
  var token = '';
  return fs.readFileAsync('token', 'utf8')
  .then(function (data) {
    token = data;
    return fs.readFileAsync('animelist.txt', 'utf8');
  })
  .then(function (data) {
    return data.trim().split('\n');
  })
  .map(function (name) {
    name = name.replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, '');
    var options = {
      uri: SERVER + 'anime/search/' + name + '?access_token=' + token,
      json: true
    };
    return rp(options)
    .then(function (body) {
      var index = 0;
      if (body.length > 1) {
        index = -1;
        console.log(JSON.stringify(body, null, 2));
        while (index < 0 || index >= body.length) {
          index = rl.question('Which anime? (0 to ' + (body.length - 1) + '): ');
        }
      }
      return [body[index].title_romaji, body[index].id];
    })
    .catch(handle);
  })
  .map(function (animeid) {
    var options = {
      uri: SERVER + 'anime/' + animeid[1] + '/airing?access_token=' + token,
      json: true
    };
    return rp(options)
    .then(function (body) {
      return [animeid[0], body];
    })
    .catch(handle);
  })
  .then(function (times) {
    var airingtimes = {};
    for (let time of times) {
      airingtimes[time[0]] = time[1];
    }
    return fs.writeFileAsync('airingtimes.json',
                             JSON.stringify(airingtimes, null, 2));
  })
  .catch(handle);
};
