import path from 'path';
import webpack from 'webpack';
import zlib from 'zlib';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackBaseConfig from './webpack.base.mjs';
import { environment, dirname } from './utils.mjs';

// Source maps are resource heavy and can cause out of memory issue for large source files.
const IS_SOURCE_MAP = false;

export default merge(
  {
    mode: 'production',
    // Stop compilation early in production
    bail: true,
    devtool: IS_SOURCE_MAP ? 'source-map' : false,
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      clean: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 'esnext',
            },
            compress: {
              ecma: 8,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: false,
            },
            output: {
              ecma: 8,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default.
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        {
          test: /\.css$/,
          resourceQuery: { not: [/raw/] },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: IS_SOURCE_MAP,
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
                    'postcss-sort-media-queries',
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
                  ],
                },
                sourceMap: IS_SOURCE_MAP,
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
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: IS_SOURCE_MAP,
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
                  ],
                },
                sourceMap: IS_SOURCE_MAP,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: IS_SOURCE_MAP,
              },
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
        NODE_ENV: 'production',
        ...environment,
      }),
      new CompressionPlugin({
        // compression is only for js & css
        test: /\.(js|css)$/,
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
      }),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(dirname, '../public/index.html'),
        environment: {
          NODE_ENV: 'production',
          ...environment,
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  },
  webpackBaseConfig,
);
