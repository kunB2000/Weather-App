import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from "dotenv-webpack"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
    clean: true,
  },
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new Dotenv()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
