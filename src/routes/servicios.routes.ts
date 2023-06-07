import { Router } from 'express';
import {
  getServicios,
  getServicioById,
  getServiciosImg,
  getUltimosProyectos
} from '../controllers/servicios.controller';

const router = Router();

router.post('/getServicios', getServicios);
router.post('/getServiciosById', getServicioById);
router.post('/getServiciosImg', getServiciosImg);
router.post('/getUltimosProyectos', getUltimosProyectos);


export default router;

