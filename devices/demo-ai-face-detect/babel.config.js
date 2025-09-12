module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        chrome: '83'
      },
      useBuiltIns: 'usage', // 自动引入 polyfill
      corejs: 3
    }]
  ]
}
