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

// transferncias
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
  await conn.beginTransaction();

  try {
    const selectSaldo = `
      SELECT saldo FROM usuarios
      WHERE email = ?
    `;
    const updateQuery = `
      UPDATE usuarios
      SET saldo = ?
      WHERE email = ?;
    `;
    // resta 7000 de la cuenta de origen
    const [result1] = await conn.execute(selectSaldo, ['pablo@gmail.com']);
    const saldo1 = Number(result1[0].saldo);
    await conn.execute(updateQuery, [saldo1 - 7000, 'pablo@gmail.com']);

    // suma 7000 a la cuenta de destino
    const [result2] = await conn.execute(selectSaldo, ['pepe@gmail.com']);
    const saldo2 = Number(result2[0].saldo);
    await conn.execute(updateQuery, [saldo2 + 7000, 'pepe@gmail.com']);

    await conn.commit();
  } catch (error) {
    console.log(error);
    await conn.rollback();
  }
}

async function logSaldos(title) {
  const [rows] = await conn.execute('SELECT email, saldo FROM usuarios;');
  console.log(title);
  console.table(rows);
}
