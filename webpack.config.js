/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const glob = require('glob')

function separatePaths(pattern) {
  const filesArr = glob.sync(pattern);
  return filesArr.reduce((acc, file) => {
    const entryName = path.relative('./src', file).replace(/\.[^/.]+$/, '');
    acc[entryName] = path.resolve(__dirname, file);
    return acc;
  }, {});
}

const migrationEntries = separatePaths("./src/db/sequelize/migrations/*")
const seederEntries = separatePaths("./src/db/sequelize/seeders/*")
const modelEntries = separatePaths("./src/db/sequelize/models/*")




module.exports = {
  target: "node",
  mode: "production",
  entry: {
    index: "./src/index.ts",
    config: "./src/db/sequelize/config/config.js",
    ...migrationEntries,
    ...seederEntries,
    ...modelEntries,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
    filename: chunkData => {
      const name = chunkData.chunk.name
      if (Object.keys(migrationEntries).includes(name)) {
        return `migrations/${path.basename(name)}.js`;
      }
      if (Object.keys(seederEntries).includes(name)) {
        return `seeders/${path.basename(name)}.js`;
      }
      if (Object.keys(modelEntries).includes(name)) {
        return `models/${path.basename(name)}.js`;
      }
      if (name === 'config') {
        return 'config/config.js';
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
    new webpack.DefinePlugin({
      'process.env': 'process.env',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: ".sequelizerc", to: "." },
        { from: "package.json", to: '.' },
      ],
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
    nodeEnv: false,
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
    splitChunks: {
      cacheGroups: {
        // migrations: {
        //   test: /[\\/]src[\\/]db[\\/]sequelize[\\/]migrations[\\/]/,
        //   name: 'migrations/',
        //   chunks: 'all',
        //   enforce: true,
        // },
        // seeders: {
        //   test: /[\\/]src[\\/]db[\\/]sequelize[\\/]seeders[\\/]/,
        //   name: 'seeders/',
        //   chunks: 'all',
        //   enforce: true,
        // },
        // models: {
        //   test: /[\\/]src[\\/]db[\\/]sequelize[\\/]models[\\/]/,
        //   name: 'models/',
        //   chunks: 'all',
        //   enforce: true,
        // },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devtool: false, // or false to disable source maps
};
