import { Router } from 'express';
import { getTypesDocument, saveUser, getUsers, updateUser } from '../controllers/users.controller';

import { TokenValidation } from '../utils/validacionToken';

const multer = require('multer')

const storageStock = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/users')
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

const router = Router();

router.post('/getTypesDocument', getTypesDocument);
router.post('/saveUser', saveUser);
router.post('/getUsers', TokenValidation, getUsers);
router.put('/updateUser', upload.single('files'), TokenValidation, updateUser);

export default router;
