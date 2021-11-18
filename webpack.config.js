const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    popup: "./src/popup.js",
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "src",
          to: ".",
          globOptions: {
            ignore: ["./popup.js"],
          },
        },
        {
          from: "./node_modules/@simonwep/pickr/dist/themes/nano.min.css",
          to: "./nano.min.css",
        },
      ],
    }),
  ],
};
