module.exports = function (api) {

    const presets = [
        [ "@babel/preset-env",
            {
                targets: {
                    edge: "17",
                    firefox: "60",
                    chrome: "67",
                    safari: "11.1",
                }
            }
        ],
        /*[ "@babel/preset-react",
            {
                "pragma": "dom",          // default pragma is React.createElement
                "pragmaFrag": "DomFrag",  // default is React.Fragment
                "throwIfNamespace": false // defaults to true
            }
        ]*/
    ];

    const plugins = [
            //"@babel/plugin-proposal-class-properties",
            //"react-hot-loader/babel",
    ];

    api.cache.forever();
    
    return {
        presets,
        plugins
    };
};