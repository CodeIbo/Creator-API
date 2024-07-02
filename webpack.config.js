/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const glob = require('glob')

function separatePaths(path) {
  const filesArr = glob.sync(path);
  return filesArr.reduce((acc, file) => {
    const entryName = file.substring(
      file.lastIndexOf('/') + 1,
      file.lastIndexOf('.')
    );
    acc[entryName] = file;
    return acc;
  }, {});
}

const migrationEntries = separatePaths("./src/db/sequelize/migrations/*")
const seederEntries = separatePaths("./src/db/sequelize/seeders/*")




module.exports = {
  target: "node",
  mode: "production",
  entry: {
    index: "./src/index.ts",
    ...migrationEntries,
    ...seederEntries,
  },
  output: {
    libraryTarget: 'commonjs',
    filename: chunkData => {
      if (Object.keys(migrationEntries).includes(chunkData.chunk.name)) {
        return `migrations/${chunkData.chunk.name}.js`;
      }
      if (Object.keys(seederEntries).includes(chunkData.chunk.name)) {
        return `seeders/${chunkData.chunk.name}.js`;
      }

      return '[name].js';
    },
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: ".sequelizerc", to: "." },
        { from: "package.json", to: '.' },
      ],
    }),
    new Dotenv({
      safe: true,
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production"),
    }),
  ],
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devtool: "source-map", // or false to disable source maps
};
