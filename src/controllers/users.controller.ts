import { Request, Response } from 'express';
import usersModel from '../models/users.model';

export const getTypesDocument = async (req: Request, res: Response) => {
  try {
    const result = await usersModel.getTypesDocumentDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getTypesDocument: ',
      error,
    });
  }
};
export const saveUser = async (req: Request, res: Response) => {
  try {
    const result = await usersModel.saveUserDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error saveUser: ',
      error,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersModel.getUsersDB(req.Usuario);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error getUsers: ',
      error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {  
  try {
    const result = await usersModel.updateUserDB(
      JSON.parse(req.body.data),
      req.file,
    )
    res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error updateUser: ',
      error,
    })
  }
}
