import { Router } from 'express';
import { getViewFile } from '../controllers/files.controller';

import { TokenValidation } from '../utils/validacionToken';

const router = Router();

router.post('/getViewFile', getViewFile);

export default router;
