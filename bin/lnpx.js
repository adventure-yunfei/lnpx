#!/usr/bin/env node

const process = require('process');
const args = process.argv.slice(2);

if (args.length) {
    require('../index')(args[0], args.slice(1));
} else {
    console.log([
        'Invalid arguments.',
        'Usage: lnpx <bin-name> <bin-args...>'
    ].join('\n'));
    process.exit(1);
}
