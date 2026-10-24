// Minimal React Native stand-in for Node tests of pure modules that import
// constants (Platform.select, StyleSheet.create). Not a renderer.
export const Platform = { OS: 'web', select: (options) => ('web' in options ? options.web : options.default) };
export const StyleSheet = { create: (styles) => styles, flatten: (style) => style };
export default { Platform, StyleSheet };

// Screen size (navigation-settings.ts asks whether this is a tablet).
export const Dimensions = { get: () => ({ width: 390, height: 844, scale: 1, fontScale: 1 }) };
