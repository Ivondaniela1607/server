import { Router } from 'express'

import {
  login,
  renovarToken,
  restablecerPassword,
  testDevelopement,
} from '../controllers/auth.controller'
import { TokenValidation } from '../utils/validacionToken'

const router = Router()

/**
 * @swagger
 * /auth/login:
 *  post:
 *   tags: [Auth]
 *   summary: Login
 *   description: Loguearse en la App
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UserLogin'
 *   responses:
 *    200:
 *     description: Login Correcto
 *    401:
 *     description: Acceso no autorizado
 *    404:
 *     description: Recurso no encontrado
 */
router.post('/login', login)
router.get('/renovar', TokenValidation, renovarToken)

router.post('/index', testDevelopement)
router.post('/restablecerPassword', restablecerPassword)

export default router
