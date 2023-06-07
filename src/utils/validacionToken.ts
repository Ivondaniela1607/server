import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
  id_usuario: string
  iat: number
  exp: number
  usuario: string
  role: string
  id_role: number
  documento: string
  apellido: string
  nombre: string
  active: boolean
  email: string
  img: string
}

// * ============================================================
// *? GENERACION DE UN JWT
// * ============================================================
export function generarJWT(
  id_usuario,
  usuario,
  email,
  role,
): Promise<string | undefined> {
  const payload = {
    id_usuario,
    email,
    role,
    usuario,
  }

  return new Promise((resolve, reject) => {
    // 4 horas { expiresIn: 60 * 60 * 8 }
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
      {
        expiresIn: process.env.TOKEN_EXPIRATION || '1h',
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('No se pudo generar el JWT')
        } else {
          resolve(token)
        }
      },
    )
  })
}

// * ============================================================
// *? VALIDACION NORMAL DE TOKEN
// * ============================================================
export const TokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  // Si no existe el token, acceso denegado
  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  // En los middlewares la info que genero se pasa a la funcion, pudiendo acceder a los
  // req.XX que necesite. Ej. en el getUsuarios

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    // Campos a recoger en los request, acceso al id, email y al nombre de usuario
    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.userRole = payload.role
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    req.Usuario = {
      id_usuario: payload.id_usuario,
      documento: payload.documento,
      id_role: payload.id_role,
      nombre: payload.nombre,
      img: payload.img,
      apellido: payload.apellido,
      email: payload.email,
      role: payload.role,
    }

    // console.log(req.Usuario);
    // console.log(payload);
    next()
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}

export const filtradoIP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let trustedIP = [process.env.IP_TRUSTED || '127.0.0.1']
  let ip = req.ip
  console.log(ip)
  if (trustedIP.includes(ip)) {
    next()
  } else {
    res.status(401).json({ ok: false, error: 'Acceso denegado' })
  }
}

// * ============================================================
// *? VALIDACION  DE TOKEN Y DE PROPIEDAD DE ARCHIVO
// * ============================================================
export const TokenValidationFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  console.log('middleware autorizacion', req.userId)
  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    console.log(req.userId)
    // req.Usuario= {
    // 	id_usuario: payload.id_usuario, usuario: payload.usuario,
    // 	 nombre: payload.nombre,img: payload.img,
    // 	apellido:payload.apellido, email: payload.email , role: payload.role,

    // }

    // const queryFicheros = `
    // select * from cistec_crm.documentos where id_usuario = ${payload.id_usuario} and (nombre = "${file}" OR doc_adjunto="${file}")`;

    try {
      console.log('next')
      next()
    } catch (error) {
      console.log(error)
      return null
    }
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}

// * ============================================================
// *? VALIDACION ROLE PERFIL ADMIN DE TOKEN
// * ============================================================
export const TokenValidationAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    if (payload.role !== 'admin' && payload.role !== 'superadmin')
      return res.status(401).json({ ok: false, error: 'Acceso denegado' })

    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    next()
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}

// * ============================================================
// *? VALIDACION ROLE PERFIL ADMIN DE TOKEN
// * ============================================================
export const TokenValidationLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    if (payload.role !== 'leads' && payload.role !== 'admin')
      return res.status(401).json({ ok: false, error: 'Acceso denegado' })

    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    // req.Usuario= {
    // 	id_usuario: payload.id_usuario, usuario: payload.usuario,
    // 	  nombre: payload.nombre,img: payload.img, apellido:payload.apellido,
    // 	   email: payload.email , role: payload.role	}

    next()
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}

// * ============================================================
// *? VALIDACION ROLE PERFIL SUPER-ADMIN DE TOKEN
// * ============================================================
export const TokenValidationSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    if (payload.role !== 'superadmin')
      return res.status(401).json({ ok: false, error: 'Acceso denegado' })

    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    //  req.Usuario= {
    // 	id_usuario: payload.id_usuario, usuario: payload. usuario,
    // 	nombre: payload.nombre,img: payload.img, apellido:payload.apellido,
    // 	 email: payload.email , role: payload.role	}

    next()
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}

export const ValidateInterceptor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token')

  console.log('entro en el interceptor', token)

  if (!token)
    return res.status(401).json({ ok: false, error: 'Acceso denegado' })

  try {
    const payload = (await jwt.verify(
      token,
      process.env.TOKEN_SECRET || 'wltokenmasUltrasecreto234234queseocurra!',
    )) as IPayload

    if (payload.role !== 'admin' && payload.role !== 'superadmin')
      return res.status(401).json({ ok: false, error: 'Acceso denegado' })

    req.userId = payload.id_usuario
    req.userName = payload.nombre
    req.UserEmail = payload.email
    req.UserApellido = payload.apellido
    req.UserImg = payload.img

    //  req.Usuario= {
    // 	id_usuario: payload.id_usuario, usuario: payload.usuario,
    // 	 nombre: payload.nombre,img: payload.img, apellido:payload.apellido,
    // 	  email: payload.email , role: payload.role		}

    next()
  } catch (e) {
    // console.log('ERROR', e.name)
    if (e.name === 'TokenExpiredError')
      return res.status(401).json({ ok: false, error: 'Token Expirado' })
    if (e.name === 'JsonWebTokenError')
      return res.status(401).json({ ok: false, error: 'Token Invalido' })
    return res.status(401).json({ ok: false, error: 'Ha ocurrido un error' })
  }
}
