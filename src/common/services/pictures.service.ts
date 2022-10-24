import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import PicturesEntity from '../entities/pictures.entity'

@Service()
export default class PicturesService {
  public getPicture(id: number) {
    // return dataSource.getRepository(PicturesEntity).findOne({ where: { id } })
    const query = dataSource
      .getRepository(PicturesEntity)
      .createQueryBuilder('pictures')
      .where('pictures.id = :id', { id })
    return query.getOne()
  }
}
