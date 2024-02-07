/* eslint-disable @typescript-eslint/no-unsafe-call */
import { join } from 'path';
import * as webpack from 'webpack';
// eslint-disable-next-line
import CopyPlugin from 'copy-webpack-plugin';

type BrowserTypes = 'chrome' | 'firefox' | 'edge';

const publicFolder = join(__dirname, 'public');
const cssFolder = join(publicFolder, 'css');
const fontFolder = join(publicFolder, 'fonts');
const graphicsFolder = join(__dirname, 'graphics');
const srcFolder = join(__dirname, 'src');
const htmlFolder = join(srcFolder, 'html');
const manifestFolder = join(srcFolder, 'manifests');
const browserPolyfill = join(
  __dirname,
  'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
);
const getConfigByBrowser = (isProd: boolean, browser: BrowserTypes): webpack.Configuration => {
  const cfg: webpack.Configuration = {
    devtool: 'source-map',
    entry: {
      background: [join(srcFolder, 'background.ts')],
      devtools: [join(srcFolder, 'devtools.ts')],
      options: [join(srcFolder, 'options.tsx')],
      popup: [join(srcFolder, 'popup.tsx')],
      wakatimeScript: [join(srcFolder, 'wakatimeScript.ts')],
    },
    // mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: 'babel-loader',
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: join(__dirname, 'dist', browser),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: cssFolder, to: 'public/css' },
          { from: fontFolder, to: 'public/fonts' },
          { from: graphicsFolder, to: 'graphics' },
          { from: htmlFolder },
          // TODO: Create a mechanism to have a firefox manifest vs chrome
          { from: join(manifestFolder, `${browser}.json`), to: 'manifest.json' },
          {
            from: browserPolyfill,
            to: 'public/js/browser-polyfill.min.js',
          },
        ],
      }),
      new webpack.DefinePlugin({
        ['process.env.API_URL']: JSON.stringify('https://api.wakatime.com/api/v1'),
        ['process.env.CURRENT_USER_API_URL']: JSON.stringify('/users/current'),
        ['process.env.HEARTBEAT_API_URL']: JSON.stringify('/users/current/heartbeats'),
        ['process.env.LOGOUT_USER_URL']: JSON.stringify('https://wakatime.com/logout'),
        ['process.env.NODE_ENV']: JSON.stringify(isProd ? 'production' : 'development'),
        ['process.env.SUMMARIES_API_URL']: JSON.stringify('/users/current/summaries'),
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
  return cfg;
};
export default (
  env: Record<string, string>,
  arv: Record<string, string>,
): webpack.Configuration[] => {
  const isProd = arv.mode !== 'development';
  return [
    getConfigByBrowser(isProd, 'chrome'),
    getConfigByBrowser(isProd, 'firefox'),
    getConfigByBrowser(isProd, 'edge'),
  ];
};
