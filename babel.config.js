module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'react-native-worklets/plugin',
        '@babel/plugin-transform-runtime',
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@assets': './src/assets/index',
                    '@app-constants': './src/app-constants/index',
                    '@atoms': './src/atoms/index',
                    '@configs': './src/configs/index',
                    '@helpers': './src/helpers/index',
                    '@hooks': './src/hooks/index',
                    '@localization': './src/localization/index',
                    '@models': './src/models/api/index',
                    '@molecules': './src/molecules/index',
                    '@navigation': './src/navigation/index',
                    '@organisms': './src/organisms/index',
                    '@rtk': './src/rtk/index',
                    '@screens': './src/screens/index',
                    '@theme': './src/theme/index',
                    '@types': './src/types/index',
                    '@utils': './src/utils/index',
                    '@validators': './src/validators/index',
                    '@packages': './src/packages/index',
                },
            },
        ],
    ],
};
