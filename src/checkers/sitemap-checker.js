// script to test bad sitemap urls
// run it node, by the end would be created sitemap-res.json with bad urls
'use strict';

var TIMEOUT = 2500;
const request = require('request');
const path = require('path');
const fs = require('fs');
const convert = require('xml-js');

const mode = 'sitemap'; // || 'badurls';

var FILEPATH = '';

switch (mode) {
  case 'badurls': {
    FILEPATH = path.join(__dirname, './sitemap-first-res.json');
    checkRes();
    break;
  }
  case 'ind': {
    checkUrlExists('https://www.lineups.com/mlb/lineups/2017/toronto-blue-jays', function(statusCode) {
      console.log(statusCode);
    });
    break;
  }
  default: {
    FILEPATH = path.join(__dirname, './../sitemap.xml');
    checkSitemap();
    break;
  }
}


function checkRes() {
  fs.readFile(FILEPATH, 'utf8', function(err, sitemapJSON) {
      console.log('err',err);
      console.log('sitemapJSON',sitemapJSON);
      const sitemapJson = JSON.parse(sitemapJSON);
      const urlsToTest = sitemapJson.map(function (urlItem) {
        return urlItem.url;
      });
      const errorLog = [];
      const goodLog = [];
      console.log('Pease wait...');
      var offset = 0;
      urlsToTest.forEach(function (itemUrl, index, array) {
        setTimeout(function() {
          console.log('Proggress:', parseFloat((((index + 1) / array.length) * 100)).toFixed(2) + '%');
          checkUrlExists(itemUrl, function(statusCode) {
            if (statusCode !== 200) {
              errorLog.push({
                status: statusCode,
                url: itemUrl
              });
            } else {
              goodLog.push(itemUrl);
            }
            if (index === array.length - 1) {
              setTimeout(function () {
                writeFile(JSON.stringify(errorLog));
                console.log('goodLog', goodLog.length);
                console.log('errorLog', errorLog.length);
              }, 5000);
            }
          });
        }, TIMEOUT + offset);
        offset += TIMEOUT;
      });
  });
}
function checkSitemap() {
  fs.readFile(FILEPATH, 'utf8', function(err, sitemapXML) {
    if (!err && sitemapXML) {
      const sitemapJson = JSON.parse(convert.xml2json(sitemapXML, {compact: true}));
      if (!sitemapJson.urlset || !sitemapJson.urlset.url) {
        return console.error('invalid sitemap');
      }
      const urlsToTest = sitemapJson.urlset.url.map(function (urlItem) {
        return urlItem.loc._text;
      });
      const errorLog = [];
      const goodLog = [];
      console.log('Pease wait...');
      var offset = 0;
      urlsToTest.forEach(function (itemUrl, index, array) {
        setTimeout(function() {
          console.log('Proggress:', parseFloat((((index + 1) / array.length) * 100)).toFixed(2) + '%');
          checkUrlExists(itemUrl, function(statusCode) {
            if (statusCode !== 200) {
              errorLog.push({
                status: statusCode,
                url: itemUrl
              });
            } else {
              goodLog.push(itemUrl);
            }
            if (index === array.length - 1) {
              setTimeout(function () {
                writeFile(JSON.stringify(errorLog));
                console.log('goodLog', goodLog.length);
                console.log('errorLog', errorLog.length);
              }, 5000)
            }
          });
        }, TIMEOUT + offset);
        offset += TIMEOUT;
      });
    } else {
      console.error('Sitemap not found');
    }
  });
}

function checkUrlExists(reqUrl, callback) {
  var req = request({ url: reqUrl, method: 'HEAD', followRedirect: false}, function (err, res) {
    if (err) return console.error('error', err);
    callback(res.statusCode);
  });
  req.end();
}

function writeFile(JSON) {
  fs.writeFile(path.join(__dirname, './sitemap-res.json'), JSON, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// function filterPlayerUrls(arr, league) {
//   return arr.filter((item1) => {return item1.loc && (!item1.loc.includes('https://www.lineups.com/'+ league +'/player-stats/') || item1.loc.includes('https://www.lineups.com/'+ league +'/player-stats/') && !playersToRedirectToMLB.includes(item1.loc.replace('https://www.lineups.com/'+ league +'/player-stats/', '')))});
// }
