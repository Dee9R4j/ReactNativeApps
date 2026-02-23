// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This plugin is often required for Expo Router
      '@babel/plugin-proposal-export-namespace-from',
      // React Native Reanimated plugin MUST be listed last
      'react-native-reanimated/plugin',
    ],
  };
};