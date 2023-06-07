import fs from 'fs'
import path from 'path'

class filesModel {
  static getViewFileDB(name: string, directory: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let ruta = __dirname + `/../../uploads/${directory}/${name}`
        fs.access(ruta, (err) => {
          if (err) {
            console.error('No such file or directory: ')
            return resolve('')
          }
          // retornar los datos
          let file = fs.readFileSync(path.join(ruta))
      
          
          const b64 = Buffer.from(file).toString('base64')
          resolve(b64)
        })
      } catch (error) {
        console.error('An error ocurred getViewFileDB: ', error)
        resolve('')
      }
    })
  }
}


export default filesModel;