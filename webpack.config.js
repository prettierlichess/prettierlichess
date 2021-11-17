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
      ],
    }),
  ],
};
