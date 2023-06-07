import { queryMysql } from '../utils/query.helper'
import _ from 'lodash'
import { encriptarPassword } from '../utils/utils'
import { send } from '../utils/mailer';
import path from 'path';
import fs from 'fs';

class AuthModel {
  static loginDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
        SELECT usuarios.*
        FROM usuarios
        WHERE (email = '${body.usuario}' OR usuario = '${body.usuario}') AND estado = 1`        
        const result = await queryMysql(query)
        resolve(new Array<T>().concat(result))
      } catch (error) {
        console.error('An error ocurred loginDB: ', error)
        reject(error)
      }
    })
  }

  static insertLogDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
        INSERT INTO logs (id_usuario, usuario, jwt, ip, msj)
        VALUES (${body.id_usuario}, '${body.usuario}', '${body.jwt}', '${body.ip}','${body.msj}')`
        const result = await queryMysql(query)
        resolve(new Array<T>().concat(result))
      } catch (error) {
        console.error('An error ocurred loginDB: ', error)
        reject(error)
      }
    })
  }

  static findModulesAndSubmodulesDB<T>(usuario: string, role: number) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
        SELECT
          titulo_modelos.id_titulo,
          titulo_modelos.nombre nombre_titulo,
          titulo_modelos.order t_order,
          modulos.nombre modulo,
          modulos.link,
          modulos.id_modulo,
          modulos.icono,
          modulos.order as m_order,
          modulos.badge as badge,
          submodulos.nombre submodulo,
          submodulos.link link_sub,
          submodulos.id_submodulo,
          submodulos.order as s_order
        FROM modulos_por_role
        INNER JOIN modulos ON modulos.id_modulo = modulos_por_role.id_modulo
        INNER JOIN titulo_modelos ON modulos.id_titulo = titulo_modelos.id_titulo
        LEFT JOIN submodulos ON submodulos.id_submodulo = modulos_por_role.id_submodulo
        WHERE id_role = ${role}
        ORDER BY titulo_modelos.order ASC, modulos.order ASC;
        `

        const result = await queryMysql(query)
        let modules = []
        let group = _.groupBy(result, 'id_titulo')
        for (const key in group) {
          const element = group[key]
          let modulesByTitle = []

          let groupModules = _.groupBy(element, 'id_modulo')
          for (const keyModule in groupModules) {
            const module = groupModules[keyModule]
            let subs = element.some((c) => c.id_submodulo)

            modulesByTitle.push({
              nombre: module[0].modulo,
              id_modulo: module[0].id_modulo,
              icono: module[0].icono,
              m_order: module[0].m_order,
              badge: module[0].badge,
              link: module[0].link,
              submodules: !subs
                ? []
                : _.orderBy(
                    module.map((c) => {
                      return {
                        link: c.link_sub,
                        nombre: c.submodulo,
                        id_submodulo: c.id_submodulo,
                        id_modulo: keyModule,
                        s_order: c.s_order,
                      }
                    }),
                    ['s_order'],
                    ['asc'],
                  ),
            })
          }
          modules.push({
            nombre: element[0].nombre_titulo,
            isTitle: true,
            t_order: element[0].t_order,
            modules: _.orderBy(modulesByTitle, ['m_order'], ['asc']),
          })
        }
        modules = _.orderBy(modules, ['t_order'], ['asc'])
        resolve(new Array<T>().concat(modules))
      } catch (error) {
        console.error('An error ocurred findModulesAndSubmodulesDB: ', error)
        reject(error)
      }
    })
  }
  static findUserByIdDB<T>(Usuario: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
        SELECT usuarios.*
        FROM usuarios
        WHERE id_usuario = ${Usuario.id_usuario}`
        const result = await queryMysql(query)
        resolve(new Array<T>().concat(result))
      } catch (error) {
        console.error('An error ocurred findUserByIdDB: ', error)
        reject(error)
      }
    });
  }

  static restablecerPassword<T>(usuario: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let findUser:any = await this.getUserDB(usuario);
        if(findUser.length > 0) {
          const geneatePassword = Math.random().toString(36).slice(-8);
          const passwordEncriptado = await encriptarPassword(geneatePassword);
          const query = `
            UPDATE usuarios SET
              password = '${passwordEncriptado}'
            WHERE documento = '${findUser[0].documento}'`
          await queryMysql(query);
          this.sendEmail(findUser[0].usuario, findUser[0], geneatePassword )
        }
        resolve({ok:true})
      } catch (error) {
        console.error('An error ocurred restablecerPassword: ', error)
        reject(error)
      }
    });
  }

  static getUserDB(usuario) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
          SELECT usuarios.*
          FROM usuarios
          WHERE email = '${usuario.email}'`
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred getWorkerDB: ', error);
        reject(error);
      }
    });
  }

  static async sendEmail(usuario, bodyUsuarios, geneatePassword ) {

    let logo = fs.readFileSync(
      path.join(`./uploads/images/logo/1672492037800.png`)
    );
    const b64_logo = Buffer.from(logo).toString('base64');

    const mimeType = 'image/png';
   
    const to = `${bodyUsuarios.email}`
    const asunto = 'Creación de usuario';
    const nombreCompleto = `${bodyUsuarios.nombre} ${bodyUsuarios.apellido}`
    const contenido = `
      <img height="50px" src="data:${{mimeType}};base64,${{b64_logo}}" alt="Aca va el logo 1" />
      <br>
      <br>
      <h2 style="color: #6772e5;"> Bienvenido a CISTEC </h2>
      <p style="color: #0c1427;">Sr/Sra ${nombreCompleto}</p> 
      <br>
      <p style="color: #0c1427;" >A continuación encontrará la contraseña para su usuario <strong>${usuario}</strong>  para el ingreso de la 
      aplicación CISTEC <br> Ingrese en el siguiente link <a href="http://localhost:4200/">http://localhost:4200/</a></p> 
      <br>
      <p style="color: #2888c3";><strong>Correo:</strong> ${bodyUsuarios.email}</p> 
      <p style="color: #2888c3";><strong>Usuario:</strong>${usuario} </p>
      <strong style="color: #2888c3"><p>Contraseña: ${geneatePassword}</p></strong>`
    const result = await send( to, 'Cistec', asunto, contenido, '');
  }

  static testDevelopementDB<T>(Usuario: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
        SELECT usuarios.*, roles.nombre role
        FROM usuarios, roles
        WHERE roles.id_role = usuarios.id_role
        AND id_usuario = ${Usuario.id_usuario}`
        const result = await queryMysql(query)
        resolve(new Array<T>().concat(result))
      } catch (error) {
        console.error('An error ocurred findUserByIdDB: ', error)
        reject(error)
      }
    });
  }
}

export default AuthModel
