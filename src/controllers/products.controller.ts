import { Request, Response } from 'express';
import productsModel from '../models/products.model';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await productsModel.getProductsDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getProducts: ',
      error,
    });
  }
};
