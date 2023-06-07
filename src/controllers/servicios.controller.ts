import { Request, Response } from 'express';
import serviciosModel from '../models/servicios.model';

export const getServicios = async (req: Request, res: Response) => {
  try {
    const result = await serviciosModel.getServiciosDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getServicios: ',
      error,
    });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  try {
    const result = await serviciosModel.getServicioByIdDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getServicioById: ',
      error,
    });
  }
};

export const getServiciosImg = async (req: Request, res: Response) => {
  try {
    const result = await serviciosModel.getServiciosImgDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getServiciosImg: ',
      error,
    });
  }
};

export const getUltimosProyectos = async (req: Request, res: Response) => {
  try {
    const result = await serviciosModel.getUltimosProyectosDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getUltimosProyectos: ',
      error,
    });
  }
};
