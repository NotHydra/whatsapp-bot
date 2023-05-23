const { Client } = require("pg");

const { Dependency } = require("./dependency");

const dependency = new Dependency();

const databaseClient = new Client({
    host: dependency.dbHost,
    user: dependency.dbUser,
    port: dependency.dbPort,
    password: dependency.dbPassword,
    database: dependency.dbDatabase
})

databaseClient.connect();

module.exports = { databaseClient }