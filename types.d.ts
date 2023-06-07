declare namespace Express {
  export interface Request {
    userId: string
    userName: string
    UserEmail: string
    UserApellido: string
    UserImg: string
    userRole: string
    Usuario: {
      id_usuario: string
      documento: string
      id_role: number
      nombre: string
      apellido: string
      email: string
      img: string
      role: string
    }
  }
}

declare module '*.json' {
  const value: any
  export default value
}
