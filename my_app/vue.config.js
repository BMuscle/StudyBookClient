module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    module: {
      // `module.rules` は 1.x での `module.loaders` と同じです
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
            }
          }
        }
      ]
    }
  }
}
