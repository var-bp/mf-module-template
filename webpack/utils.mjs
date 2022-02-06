import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import escape from 'escape-string-regexp';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { URL } from 'url'; // in browser, the URL in native accessible on window

// https://stackoverflow.com/a/66651120
export const filename = new URL('', import.meta.url).pathname;
export const dirname = new URL('.', import.meta.url).pathname; // Will contain trailing slash

export const environment = fs.existsSync(path.join(dirname, '../.env')) ? dotenv.config().parsed : {};

export const ignoredFiles = (appSrc) =>
  new RegExp(`^(?!${escape(path.normalize(appSrc + '/').replace(/[\\]+/g, '/'))}).+/node_modules/`, 'g');

// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
export const importJSON = (filePath) => JSON.parse(fs.readFileSync(new URL(filePath, import.meta.url)));

export const createSharedDependencies = (dependencies) =>
  Object.keys(dependencies).reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue]: {
        singleton: true,
        requiredVersion: dependencies[currentValue],
      },
    }),
    {},
  );

export const getHTTPSCertificate = () => {
  const certPath = path.join(dirname, './ca/RootCA.crt');
  const certKey = path.join(dirname, './ca/RootCA.key');
  const certCa = path.join(dirname, './ca/RootCA.pem');
  return {
    cert: fs.existsSync(certPath) ? fs.readFileSync(certPath) : undefined,
    key: fs.existsSync(certKey) ? fs.readFileSync(certKey) : undefined,
    ca: fs.existsSync(certCa) ? fs.readFileSync(certCa) : undefined,
  };
};
