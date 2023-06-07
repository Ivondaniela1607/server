import { Request, Response } from 'express';
import presupuestosModel from '../models/presupuestos.model';
import _ from 'lodash';


export const getPresupuestos = async (req: Request, res: Response) => {
  try {
    const result: any = await presupuestosModel.getPresupuestosDB(req.body);
    let data = [];
    let group = _.groupBy(result, 'id_presupuesto');
    let ids = [];
    for (const key in group) {
      const element = group[key];
      if(element[0].estado === 'ENVIADO' || element[0].estado === 'ACEPTADO'|| element[0].estado === 'APROBADO'|| element[0].estado === 'RECHAZADO' || element[0].estado === 'FINALIZADO') {
        ids.push(key);
      }
      data.push({
        id_presupuesto: key,
        codigo: element[0].codigo,
        descripcion_presupuesto: element[0].descripcion_presupuesto,
        fecha_solicitud: element[0].fecha_solicitud,
        fecha_creacion: element[0].fecha_creacion,
        fecha_estimada: element[0].fecha_estimada,
        fecha_real: element[0].fecha_real,
        fecha_cancelacion: element[0].fecha_cancelacion,
        estado: element[0].estado,
        id_usuario: element[0].id_usuario,
        nombre: element[0].nombre,
        apellido: element[0].apellido,
        img: element[0].img,
        documento: element[0].documento,
        email: element[0].email,
        cliente: element[0].nombre + ' ' + element[0].apellido,
        file: {},
        listCategoris: element.map((c) => {
          return {
            id_subcategoria: c.id_subcategoria,
            id_categoria: c.id_categoria,
            nombre_subcategoria: c.nombre_subcategoria,
            categoria: c.categoria,
            cantidad: c.cantidad,
          };
        })
      });
    }
    if(ids.length > 0) {
      const resultDocs: any = await presupuestosModel.getDocumentPresupuestoDB({ids});
      resultDocs.forEach(element => {
        let index = data.findIndex((c) => c.id_presupuesto == element.id_presupuesto);
        if(index != -1){
          data[index].file = element;
        }
      });
    }

    res.status(200).json(_.orderBy(data, ['fecha_solicitud'], ['desc']));
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getPresupuestos: ',
      error,
    });
  }
};

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const result = await presupuestosModel.getCategoriasDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getCategorias: ',
      error,
    });
  }
};

export const getSubcategorias = async (req: Request, res: Response) => {
  try {
    const result = await presupuestosModel.getSubcategoriasDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getSubcategorias: ',
      error,
    });
  }
};

export const savePresupuestos = async (req: Request, res: Response) => {
  try {
    const result = await presupuestosModel.savePresupuestosDB(
      req.body,
      req.body.presupuesto,
      req.Usuario
    );
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error savePresupuestos: ',
      error,
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const result = await presupuestosModel.updateStatusDB(req.body, req.Usuario);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error updateStatus: ',
      error,
    });
  }
};

export const saveDocumentPresupuesto = async (req: Request, res: Response) => {
  try {
    let body = JSON.parse(req.body.data);
    const result = await presupuestosModel.saveDocumentPresupuestoDB(body, req.file, req.Usuario);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error saveDocumentPresupuesto: ',
      error,
    });
  }
};

export const updatesaveDocumentPresupuesto = async (req: Request, res: Response) => {
  try {
    let body = JSON.parse(req.body.data);
    const result = await presupuestosModel.updatesaveDocumentPresupuestoDB(body, req.file);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error updatesaveDocumentPresupuesto: ',
      error,
    });
  }
};