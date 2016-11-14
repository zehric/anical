const display = require('./display')
const search = require('./search')
const airing = require('./airing')
const fs = require('fs')

const button = document.getElementById('andy lu')
const sb = document.getElementById('searchbar')
const save = document.getElementById('save')

var showing = false
var updated = true
var tempCal
var token = []

var animeQ = {}

var prevSearch = ''

// try {
//   var data = fs.readFileSync('animelist.json', 'utf8')
//   animeQ = JSON.parse(data)
// } catch (e) {
//   console.log(e)
// }
//

search.accessToken(token)

fs.readFile('animelist.json', 'utf8', function (err, data) {
  if (err) {
    console.log(err)
  } else {
    animeQ = JSON.parse(data)
  }
})

function showElements(calendar) {
  if (tempCal !== calendar) {
    tempCal = calendar
  }
  var pre = document.createElement('pre')
  pre.id = 'calendar'
  var node = document.createTextNode(calendar)
  pre.appendChild(node)
  var body = document.body
  body.appendChild(pre)
}

save.addEventListener('click', function (event) {
  var stringAQ = JSON.stringify(animeQ, null, 2)
  fs.writeFile('animelist.json', stringAQ, function (err) {
    if (err) {
      console.log(err)
    }
    updated = true
  })
})

button.addEventListener('click', function (event) {
  if (!showing) {
    button.innerHTML = 'Hide Calendar'
    if (tempCal && !updated) {
      showElements(tempCal)
    } else {
      updated = false
      airing(token[0]).then(function (content) {
        display(showElements)
      })
    }
  } else {
    button.innerHTML = 'Show Calendar'
    var element = document.getElementById('calendar')
    element.parentNode.removeChild(element)
  }
  showing = !showing
})

sb.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode
  if (key === 13 && sb.value 
                 && sb.value.toUpperCase() !== prevSearch.toUpperCase()) {
    prevSearch = sb.value
    sb.value = ''
    var toRemove = document.getElementsByClassName('result')
    var length = toRemove.length
    while (toRemove[0]) {
      toRemove[0].parentNode.removeChild(toRemove[0])
    }
    var saveBtn = document.getElementById('save')
    saveBtn.style.display = 'inline';
    search.go(encodeURIComponent(prevSearch), token)
    .map(function (anime) {
        var para1 = document.createElement('p')
        var para2 = document.createElement('p')
        var para3 = document.createElement('p')
        para1.className = 'result'
        para2.className = 'result'
        para3.className = 'result'
        var textNode = document.createTextNode(anime.title_romaji)
        var imgNode = document.createElement('img')
        imgNode.src = anime.image_url_lge
        var btnNode = document.createElement('button')
        if (animeQ[anime.id]) {
          btnNode.innerHTML = 'Delete'
        } else {
          btnNode.innerHTML = 'Add'
        }
        btnNode.className = 'button green'
        btnNode.addEventListener('click', function (event) {
          if (btnNode.innerHTML === 'Add') {
            btnNode.innerHTML = 'Delete'
            animeQ[anime.id] = anime.title_romaji
          } else if (btnNode.innerHTML === 'Delete') {
            btnNode.innerHTML = 'Add'
            delete animeQ[anime.id]
          }
        })
        para1.appendChild(textNode)
        para2.appendChild(imgNode)
        para3.appendChild(btnNode)
        var body = document.body
        body.appendChild(para1)
        body.appendChild(para2)
        body.appendChild(para3)
    })
    .catch(function (err) {})
  }
})
