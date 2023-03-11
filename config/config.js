require('dotenv').config();

module.exports = {
    "development": {
        "username": 'root',
        "password": process.env.DEV_DB_PASSWORD,
        "database": process.env.DEV_DB_NAME,
        "host": '127.0.0.1',
        "dialect": "mysql",
        "pool": {
            handleDisconnects: true,
            max: 13,
            min: 1,
            idle: 10000,
            acquire: 3000000
        },
        "dialectOptions": { connectTimeout: 36600000, requestTimeout: 36000000 }
    },
    "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "mysql",
    }
}