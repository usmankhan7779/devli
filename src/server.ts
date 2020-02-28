import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as fs from 'fs';
import { join } from 'path';

const environment = require('environment');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('main.server');


// (<any>global).geodatadir = join(process.cwd(), 'node_modules', 'geoip-lite', 'data');
// console.log('********************', (<any>global).geodatadir, '********************');
// import * as geoip from 'geoip-lite';

global['navigator'] = {};

import * as express from 'express';
import * as cors from 'cors';
// import * as compression from 'compression';
// import { readFileSync } from 'fs';

const httpAuth = require('http-auth');
const ENVIRONMENT = process.env.NODE_ENV;
const DOMAIN_NAMES = ['dev.lineups.com', 'staging.lineups.com', 'www.lineups.com'];
const basicAuth = httpAuth.basic({
  realm: 'Lineups Dev',
  file: join(process.cwd(), 'src', 'server-data', 'users.htpasswd')
});
import * as cookieParser from 'cookie-parser';
// import { zones } from './app/shared/services/zones';

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Express server
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, content-type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, HEAD, PUT, DELETE, OPTIONS');
    next();
});
// app.use(compression());
app.use(cookieParser());

// Authentication Middleware
app.use(authByHostname);
//


// Our index.html we'll use as our template
// const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

/* Here's we're using a webpack Alias to point to the file in the dist folder
 *   alias: {
 *     'main.server': path.join(__dirname, 'dist', 'server', 'main.js')
 *   }
 */
// Temporary (will be at: "@nguniversal/module-map-ngfactory-loader" soon)
// const { provideModuleMap } = require('@markpieszak/module-map-ngfactory-loader');
// app.engine('html', (_, options, callback) => {
//   console.log('inside engine');
//
//   const universalOptions = {
//     // Our index.html
//     document: template,
//     url: options.req.url,
//     // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
//     extraProviders: [
//       provideModuleMap(LAZY_MODULE_MAP)
//     ]
//   };
//
//   renderModuleFactory(AppServerModuleNgFactory, universalOptions)
//     .then(html => {
//       callback(null, html)
//       // console.timeEnd('render-time');
//     }).catch(e => {
//       callback(e);
//     });
//
// });

// using ngExpressEngine instead

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// debugging of request object in different environments
app.get('/test-f5fad1b55601daae79f84669503f0b58', function(req, res){
	if (req.query.redirect !== undefined) {
		return res.redirect(302, 'https://www.lineups.com/' + req.url);
	} else {
		if (typeof environment !== 'undefined' && req.query.env !== undefined) {
			req.headers['environment'] = environment;
		}
		res.send(req.headers);
	}
});

// Robots Text
app.get('/robots.txt', function(req, res) {

  fs.readFile(join(DIST_FOLDER, 'browser', 'robots.txt'), 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    res.type('text/plain');
    res.send(data);
  });
});

// ads txt
app.get('/ads.txt', function(req, res) {
  fs.readFile(join(DIST_FOLDER, 'browser', 'ads.txt'), 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    res.type('text/plain');
    res.send(data);
  });
});

// manifest.json
app.get('/manifest.json', function(req, res) {
  fs.readFile(join(DIST_FOLDER, 'browser', 'manifest.json'), 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    res.type('text/plain');
    res.send(data);
  });
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  console.log(`URL: ${req.url}`);
  console.log(`HOSTNAME: ${req.hostname}`);

  // if application is hitting directly on production
  if (DOMAIN_NAMES.indexOf(req.get('host')) === -1) {
    if (req.get('user-agent') !== 'Amazon CloudFront' && !(req.get('user-agent').startsWith('ELB-HealthChecker'))) {
      res.setHeader('Location', 'https://www.lineups.com' + req.url);
      res.writeHead(301);
      return res.end('MOVED PERMANENTLY');
    }
  }


  // detectTimeZone(req, res);

  // Set cache control headers
  // res.set({
  //   'Cache-Control' : 'public, max-age=31557600'
  // });
  res.render('index', {
    req,
    res,
    providers: [
      {
        provide: 'REQUEST',
        useValue: req
      },
      {
        provide: 'RESPONSE',
        useValue: res
      }
    ]
  });

  // Just incase we need it
  // function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
  //   console.warn('Error in SSR, serving for direct CSR');
  //   res.sendFile(join(DIST_FOLDER, 'browser', 'index.html'));
  //   return false;
  // }

  // Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
  //   res.render('index', { req });
  // });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});


/**
* Password authentication for dev and staging environments
*/
const DOMAIN_WITH_AUTH = ['dev.lineups.com', 'staging.lineups.com'];
function authByHostname(req, res, next) {
  if (
    DOMAIN_WITH_AUTH.indexOf(req.get('host')) > -1 &&
  	req.url !== '/googlef5e91d308162426d.html' &&
  	req.url !== '/manifest.json' &&
  	!(req.get('user-agent').startsWith('ELB-HealthChecker'))
  ) {

    // redirect non https to https
    if (req.get('host') == 'dev.lineups.com' && req.get('X-Forwarded-Proto') !== 'https'){
      res.setHeader('Location', 'https://' + req.headers.host + req.url);
      res.writeHead(301);
      return res.end('MOVED PERMANENTLY');
    }

    return httpAuth.connect(basicAuth)(req, res, next);
  } else {
    next();
  }
}

/*

// Custom TimeZone detect function
function detectTimeZone(req, res) {
  try {
    const ip = _getIp(req);
    const ipData = geoip.lookup(ip);
    if (ipData) {
      const lat = ipData.ll[0];
      const long = ipData.ll[1];
      const timeZone = _getTimezone(lat, long).name;
      res.set('x-timezone', timeZone);
    }
  } catch (err) {
    console.error('Time Zone was not detected', err);
  }
}

function _getIp(req) {
  if (req) {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].split(',').pop();
    }
    return req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  }
}

function _distance(position1, position2) {
  const lat1 = position1.lat;
  const lat2 = position2.lat;
  const lon1 = position1.long;
  const lon2 = position2.long;
  const R = 6371000; // Radius of the earth in metres
  const fi1 = _toRadians(lat1);
  const fi2 = _toRadians(lat2);
  const deltaFi = _toRadians(lat2 - lat1);
  const deltaLambda = _toRadians(lon2 - lon1);

  const a = Math.sin(deltaFi / 2) * Math.sin(deltaFi / 2) +
    Math.cos(fi1) * Math.cos(fi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

function _getTimezone(lat, long) {
  const coords = {lat, long};
  let closest = zones[0];
  let closest_distance = _distance(closest, coords);
  for (let i = 1; i < zones.length; i++) {
    if (_distance(zones[i], coords) < closest_distance){
      closest_distance = _distance(zones[i], coords);
      closest = zones[i];
    }
  }
  return closest;
}

function _toRadians(val) {
  return val * Math.PI / 180;
}

*/
