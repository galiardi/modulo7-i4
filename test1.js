import mysql from 'mysql2';

// coneccion a la base de datos
const pool = mysql.createPool({
  user: 'root',
  password: 'secret',
  host: 'localhost',
  port: 3306,
  database: 'individual4',
});

const promisePool = pool.promise();

// Se inicia la coneccion
const conn = await promisePool.getConnection();

// Se crean usuarios con saldo inicial
const insertQuery = `
  INSERT INTO usuarios (first_name, last_name, email, saldo)
  values (?, ?, ?, ?)
`;
await conn.execute(insertQuery, ['Pablo', 'Tapia', 'pablo@gmail.com', 20000]);
await conn.execute(insertQuery, ['Pepito', 'Pepon', 'pepe@gmail.com', 20000]);
logSaldos('Estado inicial:');

// transferencias
await transfer();
logSaldos('Resultado transferencia 1:');

await transfer();
logSaldos('Resultado transferencia 2:');

await transfer();
logSaldos('Resultado transferencia 3:');

// elimina toda la informacion (dev feature)
await conn.execute('DELETE FROM usuarios;');

// cierra la coneccion
conn.release();

//funciones
async function transfer() {
  try {
    // LLama el procedimiento almacenado transfer_ que recibe: cantidad, email origen, email destino
    await conn.execute('CALL transfer_test(?, ?, ?)', [
      7000,
      'pablo@gmail.com',
      'pepe@gmail.com',
    ]);
  } catch (error) {
    console.log(error);
  }
}

async function logSaldos(title) {
  const [rows] = await conn.execute('SELECT email, saldo FROM usuarios;');
  console.log(title);
  console.table(rows);
}
