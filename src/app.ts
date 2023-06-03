#!/usr/bin/env node

import { Server } from 'restify';

/* eslint-disable import/no-unresolved */
const restify = require('restify');
// const rjwt = require('restify-jwt-community');
const untildify = require('untildify');
const fs = require('fs');

require('dotenv').config();

const options = {
  name: 'degree',
  version: '1.0.0',
  key: '',
  cert: ''
};
const mode = process.env.MODE;

if (mode.toLowerCase() === 'https') {
  options.key = fs.readFileSync(untildify(process.env.KEY_PATH));
  options.cert = fs.readFileSync(untildify(process.env.CERT_PATH));
}

const server: Server = restify.createServer(options);

server.use(
  restify.plugins.bodyParser({
    mapParams: true
  })
);

server.on('restifyError', (req, res, err, cb) => {
  // eslint-disable-next-line no-param-reassign
  err.toJSON = function toJSON() {
    return {
      status: 'error',
      data: {
        name: err.name,
        message: err.message
      }
    };
  };

  cb();
});

server.on('BadRequestError', (req, res, err, cb) => {
  // eslint-disable-next-line no-param-reassign
  err.toJSON = function toJSON() {
    return {
      status: 'fail',
      data: {
        name: err.name,
        message: err.message
      }
    };
  };

  cb();
});

require('@api/temperature')(server);
require('@api/healthcheck')(server);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('%s listening at %s', server.name, server.url);
});
