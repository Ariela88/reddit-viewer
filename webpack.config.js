const path = require('path');

module.exports = {
    entry: './app.js', // File di ingresso principale
    output: {
        path: path.resolve(__dirname, 'dist'), // Directory di output
        filename: 'bundle.js' // Nome del file di output
    },
};
