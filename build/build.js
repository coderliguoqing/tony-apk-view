'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

var argv = process.argv.splice(2)
process.env.CODE_ENV = argv.length > 0 ? argv[0] : 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
var fs = require('fs')

//打包时，先处理static静态资源下的访问路径问题
console.log("process.env.CODE_ENV:==============",process.env.CODE_ENV)
switch (process.env.CODE_ENV) {
  case 'production':
    fs.createReadStream(path.resolve(__dirname, '../static_config/prod.config.js'))
      .pipe(fs.createWriteStream(path.resolve(__dirname, '../static/config/index.js')))
    break
  case 'mock':
    fs.createReadStream(path.resolve(__dirname, '../static_config/mock.config.js'))
      .pipe(fs.createWriteStream(path.resolve(__dirname, '../static/config/index.js')))
    break
  case 'devbuild':
    fs.createReadStream(path.resolve(__dirname, '../static_config/devbuild.config.js'))
      .pipe(fs.createWriteStream(path.resolve(__dirname, '../static/config/index.js')))
    break
  default:
    fs.createReadStream(path.resolve(__dirname, '../static_config/dev.config.js'))
      .pipe(fs.createWriteStream(path.resolve(__dirname, '../static/config/index.js')));
    break;
}

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
