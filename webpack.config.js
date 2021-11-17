const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup.js"
  },
  output: {},
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src",
          to: ".",
          globOptions: {
            ignore: ['./popup.js']
          }
        },
        {
          from: "./node_modules/@simonwep/pickr/dist/themes/nano.min.css",
          to: "./nano.min.css",
        }
      ],
    }),
  ]
};
