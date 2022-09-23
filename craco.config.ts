import { resolve } from 'path'
import { loaderByName, addAfterLoader } from '@craco/craco';

// Use craco to force create-react-app to load images as files and not base64
export default {
    devServer: {
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      }
    },
    webpack: {
        alias: {
            '@components': resolve(__dirname, 'src/components'),
            '@pages': resolve(__dirname, 'src/pages'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@constants': resolve(__dirname, 'src/constants'),
            '@state': resolve(__dirname, 'src/state'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@theme': resolve(__dirname, 'src/theme'),
            '@artifacts': resolve(__dirname, 'src/artifacts'),
            '@services': resolve(__dirname, 'src/services')
        },
        configure: (webpackConfig, { paths }) => {
            const imageLoader = {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('file-loader'),
                options: {
                    // limit: imageInlineSizeLimit,
                    name: 'static/media/[name].[ext]',
                },
            };
            const { isAdded } = addAfterLoader(
                webpackConfig,
                loaderByName('url-loader'),
                imageLoader
            );

            return webpackConfig;
        },
    },
};
