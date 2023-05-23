require('dotenv').config();

class Dependency {
    constructor() {
        this.dbHost = process.env.DB_HOST;
        this.dbUser = process.env.DB_USER;
        this.dbPort = process.env.DB_PORT;
        this.dbPassword = process.env.DB_PASSWORD;
        this.dbDatabase = process.env.DB_DATABASE;

    }
}

module.exports = { Dependency }