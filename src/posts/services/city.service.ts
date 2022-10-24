import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import CityEntity from '../entities/city.entity'

@Service()
export default class CityService {
  public getCityById(id: number) {
    const query = dataSource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .where('city.id = :id', { id })
    return query.getOne()
  }

  public getCityList(offset?: number, limit?: number) {
    const query = dataSource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .orderBy('city.id', 'DESC')
    if (
      offset !== undefined &&
      typeof offset === 'number' &&
      offset >= 0 &&
      limit !== undefined &&
      typeof limit === 'number' &&
      limit >= 0
    ) {
      query.offset(offset)
      query.limit(limit)
    }
    return query.getMany()
  }

  public getCityCount() {
    return dataSource.getRepository(CityEntity).count()
  }
}
