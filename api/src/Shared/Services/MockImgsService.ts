import {throwError} from '../../Configs/errorHandlers.js'
import fs from 'fs/promises'
import path from 'path'

const LocalBaseUrl = process.env.LOCAL_BASE_URL

export default class MockImgsService{
      static mockUploadNewImage = async (file: any) => {
        try {
          const uploadDir = './assets/uploads'
          // Asegurarse que exista la carpeta
          await fs.mkdir(uploadDir, { recursive: true })
          const newPath = path.join(uploadDir, file.originalname)
          await fs.writeFile(newPath, file.buffer)
          return `${LocalBaseUrl}/assets/uploads/${file.originalname}`
        } catch (error) {
          console.error('Error subiendo: ', error)
          throw error
        }
      }
    static mockFunctionDelete = async(imageUrl:string) => {
      const filename = path.basename(imageUrl)
        if (!path.extname(filename)) {
        throw new Error(`URL inválida, no contiene archivo: ${imageUrl}`)
                }
      const filePath = path.join('./assets/uploads', filename)
      try {
        await new Promise(res => setTimeout(res, 1000))
        await fs.unlink(filePath)
        return true
      } catch (err) {
        console.error(`Error al borrar imagen local: ${filename}`, err)
        throwError('Error deleting images', 500)
      }
    }
}