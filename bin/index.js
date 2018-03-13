#!/usr/bin/env

const meow = require('meow');
const SharpBot = require('..');

const envPaths = require('env-paths');
const paths = envPaths('SharpBot', { suffix: '' });

const wait = ms => new Promise(_ => setTimeout(_, ms));

const start = (config = {}) => {
    let bot = new SharpBot(config);

    bot.once('sharpbot-shutdown', async reboot => {
        if (reboot) {
            console.log('Process has exited. Rebooting... (3 seconds)');
            await wait(3000);
            start();
        } else {
            console.log('Bot has exited cleanly.');
        }
    });

    bot.start();
};

const cli = meow(
    `
    Usage
      $ sharpbot

    Options
      --configDir, -c <folder>
        What folder to use for storing the config files.

      --dataDir, -d <folder>
        What folder to use for storing the data files.

      --token, -t <token>
        What user token to use.

      --prefix, -p <prefix>
        What prefix to use.

      --debug, -D
        Debug SharpBot and report the results.

      --config, -C
        Run the SharpBot configuration wizard.
`,
    {
        configDir: {
            alias: 'c',
            type: 'string'
        },
        dataDir: {
            alias: 'd',
            type: 'string'
        },
        token: {
            alias: 't',
            type: 'string'
        },
        prefix: {
            alias: 'p',
            type: 'string'
        },
        debug: {
            alias: 'D',
            type: 'boolean'
        },
        config: {
            alias: 'C',
            type: 'boolean'
        }
    }
);

global.settings = {
    dataFolder: cli.flags.dataDir || paths.data,
    configsFolder: cli.flags.configDir || paths.config
};

if (cli.flags.debug) {
    require('../src/scripts/debug');
} else if (cli.flags.config) {
    require('../src/scripts/configure');
} else {
    let { token: botToken, prefix } = cli.flags;

    start({ botToken, prefix });
}
