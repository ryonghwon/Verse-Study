import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeImagesEntity from '../entities/typeImages.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeImagesService {
  public getTypeImageById(id: number) {
    const query = dataSource
      .getRepository(TypeImagesEntity)
      .createQueryBuilder('type_images')
      .leftJoinAndSelect('type_images.image', 'image')
      /*-- 학습을 위한 select() --*/
      // .select([
      //   'type_images.image',
      //   'type_images.title',
      //   'type_images.description',
      //   'image.id',
      //   'image.url'
      // ])
      .where({ id })
    return query.getOne()
  }

  public createTypeImage(
    image: PicturesEntity,
    title: string,
    description: string
  ) {
    const typeImage = new TypeImagesEntity()
    typeImage.image = image
    typeImage.title = title
    typeImage.description = description
    return typeImage.save()
  }

  public updateTypeImage(
    id: number,
    image: PicturesEntity,
    title: string,
    description: string
  ) {
    return dataSource.getRepository(TypeImagesEntity).update(id, {
      image,
      title,
      description
    })
  }

  public deleteTypeImage(id: number) {
    return dataSource.getRepository(TypeImagesEntity).delete(id)
  }
}
