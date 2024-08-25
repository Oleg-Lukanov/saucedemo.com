import { config as baseConfig } from './wdio.conf.js';

export const config = {
    ...baseConfig,
    capabilities: [{
        maxInstances: 5,
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
            args: ['--headless'],
        },
    }],
};
