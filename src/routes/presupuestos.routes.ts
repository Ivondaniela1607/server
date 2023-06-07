import { Router } from 'express';
import {
  getCategorias,
  getPresupuestos,
  getSubcategorias,
  savePresupuestos,
  updateStatus,
  saveDocumentPresupuesto,
  updatesaveDocumentPresupuesto
} from '../controllers/presupuestos.controller';
import { TokenValidation } from '../utils/validacionToken';

const multer = require('multer');
const router = Router();

const storageStock = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/presupuestos')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${Date.now()}.${ext}`)
  },
});

const upload = multer({
  storage: storageStock,
  limits: { fileSize: 10485760 },
});

/* presupuesto */
router.post('/getPresupuestos', TokenValidation, getPresupuestos);
router.get('/getCategorias', TokenValidation, getCategorias);
router.post('/getSubcategorias', TokenValidation, getSubcategorias);
router.post('/savePresupuestos', TokenValidation, savePresupuestos);
router.put('/updateStatus', TokenValidation, updateStatus);
router.post('/saveDocumentoPresupuesto',TokenValidation, upload.single('files'), saveDocumentPresupuesto);
router.put(
  '/updatesaveDocumentPresupuesto',
    TokenValidation,
    upload.single('files', 100),
    updatesaveDocumentPresupuesto
  );
export default router;
