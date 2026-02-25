module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['inline-import', { extensions: ['.sql'] }],
      [
        'module-resolver',
        {
          root: ['./src', './'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@assets': './assets',
            '@utils': './src/utils',
            '@api': './src/api',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
