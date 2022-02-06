import path from 'path';
import {
  environment,
  ignoredFiles,
  dirname,
  getHTTPSCertificate,
} from './utils.mjs';

export default {
  static: {
    directory: path.join(dirname, '../build'),
    // By default files from `contentBase` will not trigger a page reload.
    watch: {
      // Reportedly, this avoids CPU overload on some systems.
      // src/node_modules is not ignored to support absolute imports.
      ignored: ignoredFiles(path.join(dirname, 'src')),
    },
  },
  open: false,
  compress: false,
  client: {
    overlay: {
      errors: true,
      warnings: false,
    },
  },
  server: {
    type: "https",
    options: {
      ...getHTTPSCertificate(),
    },
  },
  hot: true,
  liveReload: false,
  historyApiFallback: true,
  host: '0.0.0.0',
  port: environment.MICRO_FRONTEND_HOST_PORT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
};
