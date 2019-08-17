const presets = ["@babel/env", "@babel/typescript"];

const env = {
  debug: {
    sourceMap: "inline",
    retainLines: true
  }
};

const plugins = [
  "@babel/plugin-proposal-throw-expressions",
  "@babel/proposal-class-properties",
  "@babel/proposal-object-rest-spread"
];

module.exports = { presets, env, plugins };
