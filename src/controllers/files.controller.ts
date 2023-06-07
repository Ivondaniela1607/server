import { Request, Response } from 'express';
import filesModel from '../models/files.model';

export const getViewFile = async (req: Request, res: Response) => { 
  try {
    let { name, directory } = req.body;    
    const result = await filesModel.getViewFileDB(name, directory);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getViewFile: ',
      error,
    });
  }
};