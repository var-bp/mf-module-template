import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import serverDevConfig from './server.dev.mjs';
import webpackBaseConfig from './webpack.base.mjs';
import { environment, dirname } from './utils.mjs';

export default merge(
  {
    mode: 'development',
    // Stop compilation early in production
    bail: false,
    devtool: 'cheap-module-source-map',
    devServer: serverDevConfig,
    output: {
      filename: 'js/[name].js',
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      // Don't use hashes in dev mode for better performance
      chunkFilename: 'js/[name].chunk.js',
    },
    module: {
      rules: [
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        {
          test: /\.css$/,
          resourceQuery: { not: [/raw/] },
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: {
                  mode: 'icss',
                },
              },
            },
            {
              // Options for PostCSS as we reference these options twice
              // Adds vendor prefixing based on your specified browser support in
              // package.json
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebook/create-react-app/issues/2677
                  ident: 'postcss',
                  config: false,
                  plugins: [
                    'postcss-flexbugs-fixes',
                    [
                      'postcss-preset-env',
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                    // Adds PostCSS Normalize as the reset css with default options,
                    // so that it honors browserslist config in package.json
                    // which in turn let's users customize the target behavior as per their needs.
                    'postcss-normalize',
                  ],
                },
              },
            },
          ],
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Opt-in support for SASS (using .scss or .sass extensions).
        {
          test: /\.(scss|sass)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                sourceMap: true,
                modules: {
                  mode: 'icss',
                },
              },
            },
            {
              // Options for PostCSS as we reference these options twice
              // Adds vendor prefixing based on your specified browser support in
              // package.json
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'postcss-flexbugs-fixes',
                    [
                      'postcss-preset-env',
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                    // Adds PostCSS Normalize as the reset css with default options,
                    // so that it honors browserslist config in package.json
                    // which in turn let's users customize the target behavior as per their needs.
                    'postcss-normalize',
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
      ],
    },
    plugins: [
      // Makes some environment variables available to the JS code.
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        ...environment,
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      new CaseSensitivePathsPlugin(),
      // Detect modules with circular dependencies
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: false,
        allowAsyncCycles: true,
      }),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        template: path.join(dirname, '../public/index.html'),
        environment: {
          NODE_ENV: 'development',
          ...environment,
        },
      }),
      new webpack.WatchIgnorePlugin({ paths: [path.join(dirname, '../node_modules')] }),
    ],
  },
  webpackBaseConfig,
);
