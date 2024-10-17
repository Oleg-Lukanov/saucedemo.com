import { config as baseConfig } from '../wdio.conf.js';

export const config = {
    ...baseConfig,
    capabilities: [{
        maxInstances: 5,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            // args: ['-headless'],
        },
        specs: [
            '../test/specs/**/*.js'
        ],
    }],
};
