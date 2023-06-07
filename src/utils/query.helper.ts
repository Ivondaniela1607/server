import { connectCistecServer } from "../database/database";


//FUNCION DE QUERY PARA EL MYSQL DEL SERVER
/**
 *
 * @param query
 * @returns {any}
 */

export async function queryMysql(query: string): Promise<any> {


	const conn = await connectCistecServer();

	 const consulta = await conn.query(query);

	await conn.end();
	// // console.log(bloque.rows)
    return consulta[0];

}

// export async function get(table, idValue, idTable) {
// 	const conn = await connectCistecServer();
// 	return new Promise(async (resolve, reject) => {
// 	  const sql = `SELECT * FROM ${table} WHERE ${idTable}=${idValue}`;

// 	  await conn.query(sql, (err, results) => {
// 		if (err) {
// 		  console.error("[DB]", err);
// 		  return reject({ message: err, code: 401 });
// 		}
// 		return resolve(results);
// 	  });
// 	});
//   }

// export async function insert(query, table, idTable) {
// 	const conn = await connectCistecServer();
// 	return new Promise(async (resolve, reject) => {
// 	  try {

// 		await conn.query(query, async (err, results) => {
// 		  if (err) return reject({ message: err.message, code: 400 });

// 		  const insertedData = await get(table, results.insertId, idTable);

// 		  return resolve(insertedData);
// 		});
// 	  } catch (error) {
// 		return reject(error);
// 	  }
// 	});
//   }
