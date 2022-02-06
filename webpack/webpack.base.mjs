import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
// eslint-disable-next-line import/extensions
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import { environment, dirname, importJSON, createSharedDependencies } from './utils.mjs';

const PACKAGE_JSON = importJSON(path.join(dirname, '../package.json'));

export default {
  target: ['browserslist'],
  entry: path.join(dirname, '../src/index.tsx'),
  output: {
    uniqueName: environment.MICRO_FRONTEND_HOST_NAME,
    path: path.join(dirname, '../build'),
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    publicPath: `${environment.MICRO_FRONTEND_HOST_URL}/`,
  },
  optimization: {
    // Automatically split vendor and commons
    // An in-depth guide https://medium.com/jspoint/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
    splitChunks: {
      chunks: 'all',
      maxSize: 1000 * 244, // 244KB
    },
    runtimeChunk: 'single',
  },
  resolve: {
    // This allows you to set a fallback for where webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts.
    modules: ['node_modules', path.join(dirname, '../node_modules')],
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools.
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.jsonp'],
    fallback: {
      fs: false,
    },
  },
  module: {
    // Makes missing exports an error instead of warning.
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        // https://github.com/jantimon/html-webpack-plugin/issues/1589#issuecomment-768418074
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.(css|scss|sass)$/, /\.(json|jsonp)$/],
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[hash:8][ext]',
        },
      },
      // https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.join(dirname, '../public'),
    //       to: './',
    //       globOptions: {
    //         dot: true,
    //         ignore: ['**/*.html', '**/.DS_Store'],
    //       },
    //     },
    //   ],
    // }),
    new ModuleFederationPlugin({
      name: environment.MICRO_FRONTEND_HOST_NAME,
      filename: 'js/remoteEntry.js',
      exposes: {
        './App': path.join(dirname, '../src/bootstrap.tsx'),
      },
      remotes: JSON.parse(environment.IS_MICRO_FRONTEND_REMOTE ?? false)
        ? {
            [environment.MICRO_FRONTEND_REMOTE_1_NAME]: `${environment.MICRO_FRONTEND_REMOTE_1_NAME}@${environment.MICRO_FRONTEND_HOST_URL}/js/remoteEntry.js`,
          }
        : undefined,
      shared: createSharedDependencies(PACKAGE_JSON.dependencies),
    }),
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    new StylelintPlugin(),
  ],
};
