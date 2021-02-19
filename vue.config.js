module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    lintOnSave: false,
    configureWebpack: {
        // externals: {
        //     Vue: "vue",
        // },
        mode: 'development',
        optimization: {
            splitChunks: false,
        }
    },
    filenameHashing: false,
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    }
}