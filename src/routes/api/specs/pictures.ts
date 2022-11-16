import { Router, Request, Response } from 'express'
import { Container } from 'typedi'
import path from 'path'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import config from '../../../../config'
import PicturesService from '../../../common/services/pictures.service'
import { APIErrorResult, APIResult } from '../APIResult'
import APIUtils from '../../../utils/APIUtils'


const router = Router()

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${config.PROJECT_DIR}/public/upload`)
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
//
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }
// })

// { picture : File }
// router.post(
//   '/upload',
//   upload.single('picture'),
//   async (req: Request, res: Response) => {
//     const picturesService = Container.get(PicturesService)
//     try {
//       const uploadFile = await picturesService.addUploadFile(req.file)
//       // console.log(`Upload Image : ${uploadFile}`)
//       if (uploadFile !== undefined && uploadFile !== null) {
//         const { id, url } = uploadFile
//         return res.json(APIResult({ image: { id, url } }))
//       }
//     } catch (error) {
//       return res.status(500).json(APIErrorResult(error.message))
//     }
//   }
// )

aws.config.update({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
})

const allowedExtensions = ['.png', '.jpg', '.jpeg']

const s3 = new aws.S3()

const storage = multerS3({
  s3,
  bucket: config.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (req, file, cb) {
    const directory = config.S3_DIRECTORY
    const extension = path.extname(file.originalname)
    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Unsupported extension'))
    }
    const today = Date.now()
    const url = `${directory}/${today}_${file.originalname}`
    console.log(url)
    cb(null, url)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post(
  '/upload',
  upload.single('picture'),
  async (req: Request, res: Response) => {
    const picturesService = Container.get(PicturesService)
    try {
      const uploadFile = await picturesService.addUploadFileWithS3(req.file)
      console.log(`Upload Image : ${uploadFile}`)
      if (uploadFile !== undefined && uploadFile !== null) {
        const { id, url } = uploadFile
        return res.json(APIResult({ image: { id, url }}))
      }
    } catch (error) {
      return res.status(500).json(APIErrorResult(error.message))
    }
  }
)

// /:image_id
router.delete('/image/:image_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.image_id))
  const picturesService = Container.get(PicturesService)
  try {
    const picture = await picturesService.getPicture(id)
    if (picture !== undefined && picture !== null) {
      const removePicture = await picturesService.removePicture(picture)
      console.log(`Remove Picture : ${removePicture}`)
      return res.json(APIResult({ result: true }))
    }
    return res.status(500).json(APIErrorResult('Image not found.'))
    // return res.status(500).json(APIErrorResult('이미지를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router
