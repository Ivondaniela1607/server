import { Router } from 'express';
import { getProducts } from '../controllers/products.controller';

import { TokenValidation } from '../utils/validacionToken';

const router = Router();

router.post('/getProducts', getProducts);

export default router;
