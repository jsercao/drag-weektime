module.exports = {
  dist: 'build',
  webpack(config) {
    config.devtool = '#source-map';
    config.output.publicPath = '/drag-weektime/';
    return config;
  },
};
