import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeImagesEntity from '../entities/typeImages.entity'

@Service()
export default class TypeImagesService {
  public getTypeImageById(id: number) {
    const query = dataSource
      .getRepository(TypeImagesEntity)
      .createQueryBuilder('type_images')
      .where('type_images.id = :id', { id })
    return query.getOne()
  }
}
