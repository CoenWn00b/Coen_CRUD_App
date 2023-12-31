// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const HOST = process.env.DATABASE_HOST || '127.0.0.1';
const USER = process.env.POSTGRES_USER || 'postgres';
const PASSWORD = process.env.POSTGRES_PASSWORD || 'docker';
const DATABASE = process.env.POSTGRES_DB || 'site_db';
const PORT = process.env.PORT || 5432;

module.exports = {
 development: {
   client: "postgresql",
   connection: {
     host: HOST,
     password: PASSWORD,
     user: USER,
     port: PORT,
     database: DATABASE,
   },
 },
 test: {
   client: "postgresql",
   connection: {
     host: HOST,
     password: PASSWORD,
     user: USER,
     port: PORT,
     database: DATABASE,
   },
 },

 production: {
   client: 'postgresql',
   connection: process.env.DATABASE_URL+'?ssl=no-verify',
   pool: {
     min: 2,
     max: 10
   },
   migrations: {
     directory: './migrations'
   },
   seeds: {
     directory: './seeds'
   }
 },

 staging: {
   client: "postgresql",
   connection: {
     database: "my_site",
     user: "username",
     password: "password",
   },
   pool: {
     min: 2,
     max: 10,
   },
   migrations: {
     tableName: "knex_migrations",
   },
 },
};