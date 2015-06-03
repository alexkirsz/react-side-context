import path from 'path';
import webpack from 'webpack';

export default {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'react-hot!babel?stage=0',
        include: [path.resolve('./examples'), path.resolve('./src')],
      },
    ],
  },
};
