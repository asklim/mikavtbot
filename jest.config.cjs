module.exports = {
    "notify": false,
    "notifyMode": "always",
    roots: [
        "<rootDir>/."
    ],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts"
    ],
    setupFiles: [
    ],
    setupFilesAfterEnv: [],
    testMatch: [
        //"<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}",
        //"<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}",
        "<rootDir>/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    },
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: [
    ],
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: [
        "web.js",
        "js",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ],
    watchPlugins: [
    ]
};