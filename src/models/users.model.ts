import { queryMysql } from '../utils/query.helper';
import { encriptarPassword } from '../utils/utils';
import { UtilsUser } from '../utils/utils_user';
class UsersModel {
  static getTypesDocumentDB(body: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
            SELECT * FROM tipo_documento
        `;
        const result = queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getTypesDocumentDB: ', error);
        reject(error);
      }
    });
  }

  static getUsersDB(body: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let where = makeWhereUser(body);
        const query = `
            SELECT * FROM usuarios
            ${where}
        `;
        const result = queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getUsersDB: ', error);
        reject(error);
      }
    });
  }
  
  static saveUserDB(body: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let findEmail: any = await this.getUsersDB({ email: body.email });
        if (findEmail.length > 0) {
          return resolve({ ok: false, email: true });
        }
        let findDocuent: any = await this.getUsersDB({ documento: body.documento });
        if (findDocuent.length > 0) {
          return resolve({ ok: false, document: true });
        }
        let usuario = await UtilsUser.createUser(body.nombre, body.apellido);
        const passwordEncriptado = await encriptarPassword(body.password);
        const query = `
            INSERT INTO usuarios (
                id_tipo_documento, documento, 
                usuario, nombre, apellido, password, 
                email, img, estado, cargo
            ) VALUES (
                ${body.id_tipo_documento},
                '${body.documento}',
                '${usuario}',
                '${body.nombre}',
                '${body.apellido}',
                '${passwordEncriptado}',
                '${body.email}',
                'no-image.jpg',
                1,
                'cliente'
            )
        `;
        await queryMysql(query);
        resolve({ ok: true, user: usuario });
      } catch (error) {
        console.error('An error ocurred saveUserDB: ', error);
        reject(error);
      }
    });
  }

  static getCountUsersDB() {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
          SELECT
            COUNT(*) + 1 count
          FROM usuarios;
        `;
        let result = await queryMysql(query);
        resolve(result[0]);
      } catch (error) {
        console.error('An error ocurred getCountUsersDB: ', error);
        reject(error);
      }
    });
  }

  static updateUserDB(body, file) {    
    return new Promise(async (resolve, reject) => {
      try {        
        if (body.documento != body.data_before.documento) {
          let findUser: any = await this.getUsersDB({
            documento: body.documento,
          })
          if (findUser.length > 0) {
            return resolve({
              ok: false,
              code: true,
              message: 'there is already a user with this document',
            })
          }
        }
        
        const query = `
          UPDATE usuarios SET
            id_tipo_documento = ${body.id_tipo_documento},
            documento = '${body.documento}',
            nombre = '${body.nombre}',
            apellido = '${body.apellido}',
            email = '${body.email}'
            ${file ? `, img = '${file.filename}'` : ''}
          WHERE id_usuario = ${body.data_before.id_usuario}
        `
        await queryMysql(query)
        resolve({ ok: true, message: 'success' })
      } catch (error) {
        console.error('An error ocurred updateUserDB: ', error)
        reject(error)
      }
    })
  }
}
function makeWhereUser(body) {
  let where = '';
  if (body.id_usuario) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `usuarios.id_usuario = '${body.id_usuario}'`;
  }
  if (body.documento) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `usuarios.documento = '${body.documento}'`;
  }
  if (body.email) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `usuarios.email = '${body.email}'`;
  }
  return where;
}

export default UsersModel;
