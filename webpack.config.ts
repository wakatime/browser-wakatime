/* eslint-disable @typescript-eslint/no-unsafe-call */
import { join } from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

type BrowserTypes = 'chrome' | 'firefox';

const publicFolder = join(__dirname, 'public');
const cssFolder = join(publicFolder, 'css');
const fontFolder = join(publicFolder, 'fonts');
const graphicsFolder = join(__dirname, 'graphics');
const srcFolder = join(__dirname, 'src');
const htmlFolder = join(srcFolder, 'html');
const manifestFile = join(__dirname, 'manifest.json');

const getConfigByBrowser = (isProd: boolean, browser: BrowserTypes): webpack.Configuration => {
  const cfg: webpack.Configuration = {
    entry: {
      background: [join(srcFolder, 'background.ts')],
      options: [join(srcFolder, 'options.tsx')],
      popup: [join(srcFolder, 'popup.tsx')],
    },
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: 'ts-loader',
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: join(__dirname, 'dist', browser),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: cssFolder, to: 'public/css' },
          { from: fontFolder, to: 'public/fonts' },
          { from: graphicsFolder, to: 'graphics' },
          { from: htmlFolder },
          // TODO: Create a mechanism to have a firefox manifest vs chrome
          { from: manifestFile },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
  return cfg;
};
export default (env: Record<string, string>): webpack.Configuration[] => {
  const isProd = env.mode === 'production';
  return [getConfigByBrowser(isProd, 'chrome'), getConfigByBrowser(isProd, 'firefox')];
};
