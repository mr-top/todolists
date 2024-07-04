const Client = require('pg').Client;

module.exports = {
    async dbQuery(statement, ...params){
        const client = new Client({database: 'todo_lists'});

        await client.connect();
        const result = await client.query(statement, params);
        await client.end();

        return result;
    }
}