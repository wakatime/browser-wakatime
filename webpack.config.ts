import * as path from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default (): webpack.Configuration[] => {
  const cfgs: webpack.Configuration[] = [];
  const chromeExtCfg: webpack.Configuration = {
    entry: {
      app: [path.join(__dirname, 'src', 'app.tsx')],
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
      path: path.join(__dirname, 'dist', 'chrome'),
    },
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
  cfgs.push(chromeExtCfg);

  return cfgs;
};
