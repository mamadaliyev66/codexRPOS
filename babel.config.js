// babel.config.js
module.exports = function (api) {
  api.cache(false);
  const isTest = process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';
  return {
    presets: ['babel-preset-expo'],
    plugins: isTest ? [] : [],
  };
};
