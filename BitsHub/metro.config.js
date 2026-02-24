const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add SQL support
config.resolver.sourceExts.push("sql");

// SVG transformer: treat .svg as source (not asset)
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer/expo"
);

module.exports = config;
