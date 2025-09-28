import admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import path from 'path'
import crypto from 'node:crypto'

// Ruta al archivo JSON de credenciales
const serviceAccount = path.resolve('firebase-admin-key.json')

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'apifirexperimental.appspot.com'
  // databaseURL: "https://<tu-proyecto>.firebaseio.com", // Reemplaza con tu URL de Firebase
})

const bucket = getStorage().bucket() // Referencia al bucket raíz

export class FirebaseServices {
  static uploadImage = async (fileToUpload: any) => {
    try {
      const { buffer: fileBuffer, originalname: originalName, mimetype: mimeType } = fileToUpload
      // Genera un nombre único para el archivo
      const fileName = `mechanicProject/${crypto.randomUUID()}${path.extname(originalName)}`
      const file = bucket.file(fileName)

      // Metadatos para el archivo
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: crypto.randomUUID() // Token para URL pública
        },
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000'
      }

      // Subir el buffer
      await file.save(fileBuffer, {
        metadata,
        public: false, // privado, pero con token de acceso
        validation: 'md5'
      })

      // Construir URL de descarga con token
      // const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;
      const encodedName = encodeURIComponent(fileName)
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedName}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`

      return { downloadURL, fileName }
    } catch (error) {
      console.error('Firebase UploadImage error: ', error)
    }
  }

  static deleteImage = async (fileUrl: string): Promise<string> => {
    try {
      const encodedFileName = fileUrl.split('/o/')[1].split('?')[0]
      const fileName = decodeURIComponent(encodedFileName)
      const nameSendered = fileName.split('/')[1]
      await FirebaseServices.#deleteImageByUrl(fileName)
      return `Image ${nameSendered} deleted successfully`
    } catch (error) {
      console.error('Firebase deleteImage error: ', error)
      return 'Warning: Problemas borrando imagen'
    }
  }

  static readonly #deleteImageByUrl = async (fileName: string) => {
    const file = bucket.file(fileName)
    await file.delete()
  }
}
