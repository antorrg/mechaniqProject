import { deleteFromCloudinary, uploadToCloudinary } from '../../cloudinary.js'
import MockImgsService from './MockImgsService.js'
import envConfig from '../../Configs/envConfig.js'


const deleteImage = envConfig.Status !== 'production'? MockImgsService.mockFunctionDelete : deleteFromCloudinary
const selectUploaders = env.Status !== 'production'? MockImgsService.mockUploadNewImage : uploadToCloud

export default class ImgsService {

  static uploadNewImage = async(file) =>{
    return await selectUploaders(file)
  } 


  static oldImagesHandler = async(imageUrl) => {
    return await deleteImage(imageUrl)
  }

}
  const uploadToCloud = async (file) => {
    const result = await uploadToCloudinary(file)
    const httpsWebpUrl = cloudinary.url(result.public_id, {
      secure: true,
      format: 'webp',
      transformation: [
        { width: 'auto', crop: 'scale' },
        { fetch_format: 'auto', quality: 'auto' }
      ]
    })
    return httpsWebpUrl
  }