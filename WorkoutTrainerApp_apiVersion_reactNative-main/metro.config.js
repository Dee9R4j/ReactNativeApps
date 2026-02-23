const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true
  }
};

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  resolverMainFields: ['react-native', 'main'],
  extraNodeModules: {
    ...require('node-libs-react-native'),
    'react-native-url-polyfill': path.resolve(
      __dirname,
      'node_modules/react-native-url-polyfill'
    )
  }
};

module.exports = config;