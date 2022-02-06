import path from 'path';
import cors from 'cors';
import express from 'express';
import https from 'https';
import { dirname, environment, getHTTPSCertificate } from './utils.mjs';

const APP = express();
const PORT = environment.MICRO_FRONTEND_HOST_PORT;
const HOST = '0.0.0.0';

APP.use(cors()); // cors({ credentials: true, origin: `https://${HOST}:${PORT}` }) // to pass cookies in the request
APP.use(express.static(path.join(dirname, '../build')));

// Serve static Brotli files
APP.get('*.js', (req, res, next) => {
  req.url = `${req.url}.br`;
  res.set('Content-Encoding', 'br');
  res.set('Content-Type', 'text/javascript');
  next();
});

// Serve static Brotli files
APP.get('*.css', (req, res, next) => {
  req.url = `${req.url}.br`;
  res.set('Content-Encoding', 'br');
  res.set('Content-Type', 'text/css');
  next();
});

APP.get('*', (req, res) => {
  res.sendFile(path.join(dirname, '../build/index.html'));
});

const httpsServer = https.createServer(getHTTPSCertificate(), APP);

httpsServer.listen(PORT, HOST, () => {
  console.log(`Production server running at: https://localhost:${PORT}`);
});
