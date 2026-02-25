const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");
/** @type {import('expo/metro-config').MetroConfig} */


const config = getSentryExpoConfig(__dirname);

// Use the SVG transformer for .svg files
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// Ensure .svg is treated as a source extension, not an asset
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg", "sql"],
};

module.exports = config;
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;