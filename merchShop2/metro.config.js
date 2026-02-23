// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Expo Router Metro plugin for deep linking
config.resolver.sourceExts.push('mjs', 'js', 'jsx', 'json', 'ts', 'tsx', 'cjs');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg'); // If you don't use SVGs as assets

module.exports = config;