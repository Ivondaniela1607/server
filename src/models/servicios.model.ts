import moment from 'moment';
import { queryMysql } from '../utils/query.helper';

class ServiciosModel {

  static getServiciosDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
          SELECT * FROM servicios    
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getServiciosDB: ', error);
        reject(error);
      }
    });
  }

  static getServicioByIdDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        let where = makeWhere(body);
        const query = `
          SELECT * FROM servicios   
          ${where} 
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getServicioByIdDB: ', error);
        reject(error);
      }
    });
  }
  
  static getServiciosImgDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        let where = makeWhere(body);

        const query = `
          SELECT * FROM servicios_img  
          ${where} 
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getServicioByIdDB: ', error);
        reject(error);
      }
    });
  }

  static getUltimosProyectosDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
          SELECT * FROM ultimos_proyectos  
        `;
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getServicioByIdDB: ', error);
        reject(error);
      }
    });
  }
}

function makeWhere(body) {
  let where = '';
  if (body.id_servicio) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `servicios.id_servicio = '${body.id_servicio}'`;
  }
  if (body.id_servicios_img) {
    where += !where ? 'WHERE ' : '';
    where += where == 'WHERE ' ? '' : ' AND ';
    where += `servicios_img.id_servicio = '${body.id_servicios_img}'`;
  }
  return where;
}


export default ServiciosModel;
