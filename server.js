#!/usr/bin/env node
const argv = require("yargs").argv;
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

function runServer(entryPointFilename) {
  const webpackConfig = {
    mode: "development",
    entry: entryPointFilename,
    output: {
      filename: "bundle.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "layout.html")
      })
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
    }
  };

  const devServerOptions = {
    before: function before(app) {
      app.get("/.assets/*", (req, res) => {
        const filename = path.join(__dirname, "/", req.path);
        res.sendFile(filename);
      });
    },
    open: true,
    stats: {
      colors: true
    }
  };

  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(8080, "127.0.0.1", () => {
    console.log("Starting server on http://localhost:8080");
  });
}

if (argv.entry === undefined) {
  console.log("Usage: board-state-playground --entry entry-point.jsx");
} else {
  runServer(argv.entry);
}
