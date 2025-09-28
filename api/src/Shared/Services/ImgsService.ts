import { FirebaseServices } from '../../ExternalProviders/firebase.js'
import MockImgsService from './MockImgsService.js'
import envConfig from '../../Configs/envConfig.js'

const deleteImageByUrl = envConfig.Status !== 'production' ? MockImgsService.mockFunctionDelete : FirebaseServices.deleteImage
const selectUploaders = envConfig.Status !== 'production' ? MockImgsService.mockUploadNewImage : FirebaseServices.uploadImage

export default class ImgsService {
  static uploadNewImage = async (file: any) => {
    return await selectUploaders(file)
  }

  static deleteImage = async (imageUrl: string) => {
    return await deleteImageByUrl(imageUrl)
  }
}
