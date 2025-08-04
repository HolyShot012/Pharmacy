const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Windows-specific resolver settings
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;