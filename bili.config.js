module.exports = {
  banner: true,
  moduleName: 'dragWeektime',
  name: 'drag-weektime',
  format: ['umd', 'umd-min', 'cjs', 'es'],
  plugins: ['vue'],
  vue: {
    css: 'dist/drag-weektime.css',
  },
  external: ['vue', 'vuetify'],
  globals: {
    Vue: 'vue',
  },
};
