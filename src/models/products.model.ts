import { queryMysql } from '../utils/query.helper';
import products from '../products-dummy.json';
class ProductModel {
  static getProductsDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        // const query = `
        // SELECT usuarios.* , roles.nombre role, cargos_usuarios.nombre cargo
        // FROM usuarios, roles, cargos_usuarios
        // WHERE roles.id_role = usuarios.id_role
        // AND cargos_usuarios.id_cargos = usuarios.id_cargo
        // AND (email = '${body.usuario}' OR usuario = '${body.usuario}') AND estado = 1`;

        // const result = await queryMysql(query);
        let data: any = [...products];
        if (body.id_producto) {
          data = data.filter((c) => c.id == body.id_producto);
        }
        resolve(new Array<T>().concat(data));
      } catch (error) {
        console.error('An error ocurred getProductsDB: ', error);
        reject(error);
      }
    });
  }
}

export default ProductModel;
