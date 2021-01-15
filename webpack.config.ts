/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import * as path from 'path';
import * as webpack from 'webpack';
const exec = require('child_process').exec;

type browserTypes = 'chrome' | 'firefox';
const getConfigsByBrowser = (isProd: boolean, browser: browserTypes): webpack.Configuration => {
  const outPutFolder = path.join(__dirname, 'dist', browser);
  const sourceFolder = path.join(__dirname, 'src');
  return {
    entry: {
      background: path.join(__dirname, 'src', 'background.ts'),
      options: [path.join(__dirname, 'src', 'options.tsx')],
      popup: [path.join(__dirname, 'src', 'popup.tsx')],
    },
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: 'ts-loader',
        },
        {
          test: /\.(css|less)$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: outPutFolder,
    },
    plugins: [
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
            // Need this hook for some reason less-loader is problematic
            // TODO: Use a regular webpack plugin to make this easier
            exec(`cp -R ${path.join(__dirname, 'graphics')} ${path.join(outPutFolder)}`);
            exec(
              `cp ${path.join(sourceFolder, 'manifest', 'manifest.json')} ${path.join(
                outPutFolder,
              )}`,
            );
            exec(
              `cp ${path.join(sourceFolder, 'html', 'options.html')} ${path.join(outPutFolder)}`,
            );
            exec(
              `cp ${path.join(sourceFolder, 'html', 'options.html')} ${path.join(outPutFolder)}`,
            );
            exec(
              `lessc ${path.join(sourceFolder, 'less', 'options.less')} ${path.join(
                outPutFolder,
                'options.css',
              )}`,
            );
            exec(
              `lessc ${path.join(sourceFolder, 'less', 'popup.less')} ${path.join(
                outPutFolder,
                'popup.css',
              )}`,
            );
          });
        },
      },
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    },
  };
};
export default (env: Record<string, string>, arg: unknown): webpack.Configuration[] => {
  console.log('env', env);
  console.log('arg', arg);
  const isProd = env.mode !== 'development';
  return [getConfigsByBrowser(isProd, 'chrome'), getConfigsByBrowser(isProd, 'firefox')];
};
