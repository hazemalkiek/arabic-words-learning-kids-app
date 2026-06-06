const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure m4a audio files are bundled
if (!config.resolver.assetExts.includes('m4a')) {
  config.resolver.assetExts.push('m4a');
}

module.exports = config;
