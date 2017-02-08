'use strict';
var config = {
    development: {
        server_port: 8081,
        log: {
            file_name: './server_logs/server.log',
            print_console: true
        },
        mongo: {
            host: 'localhost',
            port: 27017,
            username: 'test',
            password: '1',
            database: 'media'
        }
    },

    production: {

    }
};
module.exports = config['development'];