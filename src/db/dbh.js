const mysql = require('mysql2/promise');

const typeCast = (field, defaultTypeCasting ) => {
  if (field.type === 'TINY') {
    return !!+field.string();
  }
  return defaultTypeCasting();
}

const connect = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MTSQL_PASS,
      database: process.env.MYSQL_DB,
      charset: 'utf8',
      typeCast: typeCast,
      multipleStatements: true
    });

    console.log(`Connected to MySQL on database: ${process.env.MYSQL_DB}`);
    return conn;
  } catch (e) {
    console.log('MySQL connection error: ', e.message);
    conn.destroy();
  }
}

module.exports = { connect };