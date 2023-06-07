import moment from 'moment';
import { queryMysql } from '../utils/query.helper';
import path from 'path';
import fs from 'fs';
import { send } from '../utils/mailer';

class ProductModel {
  static getPresupuestosDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        let where = `
        WHERE presupuestos.id_presupuesto = items_presupuestos.id_presupuesto
        AND categorias.id_categoria = items_presupuestos.id_categoria
        AND subcategorias.id_subcategoria = items_presupuestos.id_subcategoria
        AND usuarios.id_usuario = presupuestos.id_usuario
        `;
        where = makeWhere(body, where);
        const query = `
          SELECT 
            presupuestos.*,
            subcategorias.*,
            categorias.*,            
            items_presupuestos.cantidad,
            usuarios.nombre, 
            usuarios.apellido, 
            usuarios.img,
            usuarios.documento,
            usuarios.email
          FROM presupuestos, items_presupuestos, categorias, subcategorias,
          usuarios       
          ${where}
          ORDER BY fecha_solicitud DESC
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getPresupuestosDB: ', error);
        reject(error);
      }
    });
  }

  static getCategoriasDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM categorias`;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getCategoriasDB: ', error);
        reject(error);
      }
    });
  }

  static getSubcategoriasDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `SELECT * 
          FROM subcategorias 
          WHERE id_categoria = ${body.id_categoria}
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getSubcategoriasDB: ', error);
        reject(error);
      }
    });
  }

  static getCodeEstimateDB(body: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let year = moment().format('YYYY');
        const query = `
            SELECT COUNT(*) + 1 count
            FROM presupuestos
            WHERE YEAR(fecha_solicitud) = '${year}';
        `;
        const result = await queryMysql(query);
        resolve({ code: year + '-' + result[0].count });
      } catch (error) {
        console.error('An error ocurred getCodeEstimateDB: ', error);
        reject(error);
      }
    });
  }

  static updateStatusDB(body: any, usuario:any) {
    return new Promise(async (resolve, reject) => {
      try {
        const queryUser = `
          SELECT email FROM usuarios where cargo = 'admin'
        `;
        const resultQuery = await queryMysql(queryUser);        
        let emails = resultQuery;    
        let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        let parameters = '';
        if (body.estado === 'APROBADO') {
          parameters += `
          fecha_creacion = '${fecha}',
          fecha_estimada = '${body.fecha_estimada}'
          `;
        } else if (body.estado === 'FINALIZADO') {
          parameters += `
          fecha_real = '${fecha}'
          `;
        }else if (body.estado === 'CANCELADO') {
          parameters += `
          fecha_cancelacion= '${fecha}'
          `;
        }
        else if (body.estado === 'ENVIADO') {
          parameters += `
          fecha_envio = '${fecha}'
          `;
          this.sendEmail(emails, body, usuario );
        }else if (body.estado === 'RECHAZADO') {
          parameters += `
          fecha_rechazada = '${fecha}'
          `;
        }else if (body.estado === 'PENDIENTE') {
          parameters += `
          fecha_real = '${fecha}'
          `;
        } else if (body.estado === 'ACEPTADO') {
          parameters += `
          fecha_aceptacion = '${fecha}'
          `;
        } 
        else {
          parameters += `
          fecha_cancelacion = '${fecha}'
          `;
        }
        const query = `
        UPDATE presupuestos SET
          estado = '${body.estado}',
          ${parameters}
        WHERE id_presupuesto = ${body.id_presupuesto}
        `;
        const result = await queryMysql(query);
        this.sendEmail(emails, body, usuario);
        resolve({ ok: true, message: 'success', date: fecha });
      } catch (error) {
        console.error('An error ocurred updateStatusDB: ', error);
        reject(error);
      }
    });
  }

  static savePresupuestosDB<T>(body: any, products: any, usuario: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const queryUser = `
          SELECT email FROM usuarios where cargo = 'admin'
        `;
        const resultQuery = await queryMysql(queryUser);        
        let emails = resultQuery;    
        let resCode: any = await this.getCodeEstimateDB({});
        const query = `
          INSERT INTO presupuestos (
            codigo, descripcion_presupuesto, id_usuario
          ) 
          VALUES (
            '${resCode.code}',
            '${body.descripcion}',
            ${usuario.id_usuario}
          )
        `;
        const result = await queryMysql(query);
        let id = result.insertId;
        if (body.presupuesto.length > 0) {
          let queryItems = `
            INSERT INTO items_presupuestos(
              id_presupuesto, id_categoria, id_subcategoria, cantidad
            ) VALUES
          `;
          products.forEach((element) => {
            queryItems += `(
              ${id},
              '${element.categoria.id_categoria}',
              ${element.subcategoria ? `'${element?.subcategoria?.id_subcategoria}',` : `'',`}
              ${element.cantidad}
            ),`;
          });
          queryItems = queryItems.substring(0, queryItems.length - 1);
          const result2 = await queryMysql(queryItems);
        }

        this.sendEmail(emails, body, usuario, products );
        resolve({ ok: true, message: 'success'});
      } catch (error) {
        console.error('An error ocurred savePresupuestos: ', error);
        reject(error);
      }
    });
  }

  static async sendEmail(emails, body, usuario, products? ) {
    let contenido = '';    
    let asunto = '';
    let to = '';

    if(body.estado === 'ACEPTADO' || body.estado === 'RECHAZADO') {
      emails.forEach(element => {
        to += `${element.email} ,`
      });
      asunto += `Presupuesto ${body.estado}`
      contenido = `<h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>El cliente ha ${body.estado} el presupuesto </p> 
        <p>${body.presupuesto.file.nombre_original}</p>
        
        <strong><p>Atentamente:</p></strong> <p>${usuario.nombre} </p>
        <strong><p>Email: </p></strong> <p>${usuario.email} </p>
      `;
    }else if(body.estado === 'ENVIADO'){
      to += body.presupuesto.email;
      asunto += 'Su presupuesto ha sido enviado' 
      contenido = `<h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>Puede visualizar su presupuesto en el sitio web de Grafisant </p> 
        <strong><p>Atentamente:</p></strong> 
        <p style="color: #6610f2;">
          GRAFISANT imprenta 
        </p>
      `;
    }else if(body.estado === 'CANCELADO'){
      to += body.presupuesto.email;
      asunto += 'Su presupuesto ha sido cancelado' 
      contenido = `<h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>Ha sido cancelado su presupuesto </p> 
        <strong><p>Atentamente:</p></strong> 
        <p style="color: #6610f2;">
          GRAFISANT imprenta 
        </p>
      `;
    }else if(body.estado === 'FINALIZADO'){
      to += body.presupuesto.email;
      asunto += 'Su presupuesto ha sido finalizado' 
      contenido = `<h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>Ha sido terminado el trabajo solicitado  </p> 
        <strong><p>Atentamente:</p></strong> 
        <p style="color: #6610f2;">
          GRAFISANT imprenta 
        </p>
      `;
    }else if(body.estado === 'APROBADO'){
      to += body.presupuesto.email;
      asunto += 'Su presupuesto ha sido aprobado'
      contenido = `<h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>Ha sido aprobado su proyecto </p> 
        <strong><p>Atentamente:</p></strong> 
        <p style="color: #6610f2;">
          GRAFISANT imprenta 
        </p>
      `;
    }else {
      asunto += 'Solicitud de presupuesto'
      emails.forEach(element => {
        to += `${element.email},`
      });
      contenido += ` <h2 style="color: #6610f2;"> GRAFISANT imprenta </h2>
        <br>
        <strong><p style="color: #0c1427;">Cordial saludo</p></strong> 
        <p>Solicito por favor presupuesto con la siguiente descripción: </p> 
        <p>${body.descripcion}</p>
      `;
      products.forEach(element => {
        contenido += `
        <div style="display:flex"><strong><p>Categoria: </p></strong> <p>${element.categoria.categoria} </p></div>
        <div style="display:flex"><strong><p>Subcategoria: </p></strong> <p>${element?.subcategoria?.nombre_subcategoria} </p></div>
        <div style="display:flex"><strong><p>Cantidad: </p></strong> <p>${element.cantidad} </p></div>
          <hr>
        `;
      });  

      contenido += `
      <strong><p>Atentamente:</p></strong> <p>${usuario.nombre} </p>
      <strong><p>Email: </p></strong> <p>${usuario.email} </p>
    `
    ;
    }
    const result = await send(to, 'Grafisant imprenta', asunto, contenido, '');
  }


  static saveDocumentPresupuestoDB(body, files, usuario) {
    return new Promise(async (resolve, reject) => {
      try {
        const queryUser = `
          SELECT email FROM usuarios where cargo = 'admin'
        `;
        const resultQuery = await queryMysql(queryUser);        
        let emails = resultQuery;    
        if (files) {
          let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
          let query = `
          INSERT INTO documentos_presupuestos(
            id_presupuesto, ruta, nombre_original, nombre_archivo 
          ) VALUES
        `;
          query += `(
            ${body.id_presupuesto},
            '${files.path}',
            '${files.originalname}',
            '${files.filename}'
          )`;
          const result = await queryMysql(query);
          let id = result.insertId;
          let resultUpdate;
          if(result) {
            const query = `
              UPDATE presupuestos SET
                estado = 'ENVIADO',
                fecha_envio = '${fecha}'
                WHERE id_presupuesto = ${body.id_presupuesto} 
            `;
            await queryMysql(query);
            this.sendEmail(emails, body, usuario, body.listCategoris );
          }
          resolve({ ok: true, message: 'success', id });
        }
        
      } catch (error) {
        console.error('An error ocurred saveDocumentPresupuestoDB: ', error);
        reject(error);
      }
    });
  }

  static getDocumentPresupuestoDB(body) {
    return new Promise(async (resolve, reject) => {
      try {
          const query = `
          SELECT * 
          FROM documentos_presupuestos
          WHERE id_presupuesto IN(${body.ids}) 
        `;
        const result = await queryMysql(query);
        resolve(result);
   
      } catch (error) {
        console.error('An error ocurred getDocumentPresupuestoDB: ', error);
        reject(error);
      }
    });
  }

  static updatesaveDocumentPresupuestoDB(body, files) {
    return new Promise(async (resolve, reject) => {
      try {
        if (files) {
          const query = `
          UPDATE documentos_presupuestos SET
            ruta = '${files.path}',
            nombre_original = '${files.originalname}',
            nombre_archivo = '${files.filename}'
          WHERE id_presupuesto = ${body.id_presupuesto}
        `;
        await queryMysql(query);
   
        }

        resolve({ ok: true, message: 'success' });
      } catch (error) {
        console.error('An error ocurred updatesaveDocumentPresupuestoDB: ', error);
        reject(error);
      }
    });
  }

}

function makeWhere(body, where: string) {
  if (body.id_usuario) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `presupuestos.id_usuario = ${body.id_usuario}`;
  }
  if (body.date) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `presupuestos.fecha_solicitud BETWEEN '${body.date[0]}' AND '${body.date[1]}'`;
  }
  if (body.status) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `presupuestos.estado = '${body.status}'`;
  }
  return where;
}

export default ProductModel;
