import { config as baseConfig } from '../wdio.conf.js';

export const config = {
    ...baseConfig,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu'],
        },
        specs: [
            '../test/specs/**/*.js'
        ],
    }],
};

  