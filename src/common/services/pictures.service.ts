import * as fs from 'fs'
import { Service } from 'typedi'
import config from '../../../config'
import { dataSource } from '../../dataSource'
import PicturesEntity from '../entities/pictures.entity'

@Service()
export default class PicturesService {
  public getPicture(id: number) {
    // return dataSource.getRepository(PicturesEntity).findOne({ where: { id } })
    const query = dataSource
      .getRepository(PicturesEntity)
      .createQueryBuilder('pictures')
      .where({ id })
    return query.getOne()
  }

  public getPictureByIdAndSelect(id: number) {
    const query = dataSource
      .getRepository(PicturesEntity)
      .createQueryBuilder('pictures')
      .select(['pictures.id', 'pictures.url'])
      .where({ id })
    return query.getOne()
  }

  public addPicture(
    name: string,
    stored_name: string,
    stored_path: string,
    mime_type: string,
    url: string
  ) {
    const picture = new PicturesEntity()
    picture.name = name
    picture.stored_name = stored_name
    picture.stored_path = stored_path
    picture.mime_type = mime_type
    picture.url = url
    return picture.save()
  }

  public addUploadFile(uploadFile: any) {
    if (uploadFile !== undefined) {
      const {
        originalname: name,
        destination: storedPath,
        filename: storedName,
        mimetype
      } = uploadFile
      let url = `${storedPath}/${storedName}`
      const idx = storedPath.lastIndexOf('public/')
      if (idx >= 0) {
        url = url.substring(idx + 6)
      }
      return this.addPicture(name, storedName, storedPath, mimetype, url)
    }
  }

  public addUploadFileWithS3(uploadFile: any) {
    if (uploadFile !== undefined) {
      // console.log(uploadFile)
      const { originalname: name, key, location: url, mimetype } = uploadFile
      const storedPath = config.S3_DIRECTORY
      const storedName = key.replace(`${storedPath}/`, '')
      // console.log(name, storedName, storedPath, mimetype, url)
      return this.addPicture(name, storedName, storedPath, mimetype, url)
    }
  }

  public removePicture(picture: PicturesEntity) {
    fs.unlink(`${config.PROJECT_DIR}/public/upload/${picture.stored_name}`, () => {})
    return dataSource.getRepository(PicturesEntity).remove(picture)
  }
}
