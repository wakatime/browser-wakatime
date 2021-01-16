/* eslint-disable @typescript-eslint/no-unsafe-call */
import { join } from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const publicFolder = join(__dirname, 'public');
const cssFolder = join(publicFolder, 'css');
const fontFolder = join(publicFolder, 'fonts');
export default (): webpack.Configuration[] => {
  const cfgs: webpack.Configuration[] = [];
  const chromeExtCfg: webpack.Configuration = {
    entry: {
      app: [join(__dirname, 'src', 'app.tsx')],
    },
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
      path: join(__dirname, 'dist', 'chrome'),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: cssFolder, to: 'public/css' },
          { from: fontFolder, to: 'public/fonts' },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
  cfgs.push(chromeExtCfg);

  return cfgs;
};
