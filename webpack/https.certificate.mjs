import util from 'util';
import path from 'path';
import { exec } from 'child_process';
import { dirname } from './utils.mjs';

const pExec = util.promisify(exec);
const cwd = path.join(dirname, './ca');

// https://support.securly.com/hc/en-us/articles/206058318-How-to-install-the-Securly-SSL-certificate-on-Mac-OSX-
async function createHTTPSCertificate() {
  try {
    await pExec('mkdir ca', { cwd: dirname });
    // https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8
    await pExec(
      'openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=UA/CN=localhost.local"',
      { cwd },
    );
    await pExec('openssl x509 -outform pem -in RootCA.pem -out RootCA.crt', { cwd });
  } catch (error) {
    console.error(error);
  }
}

createHTTPSCertificate();
