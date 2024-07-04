const Client = require('pg').Client;
const config = require('./config');

const isProduction = (config.NODE_ENV === "production");
const CONNECTION = {
  connectionString: config.DATABASE_URL,
  //ssl: isProduction,  // See note below
  ssl: { rejectUnauthorized: false },
};

module.exports = {
    async dbQuery(statement, ...params){
        const client = new Client(CONNECTION);

        await client.connect();
        const result = await client.query(statement, params);
        await client.end();

        return result;
    }
}