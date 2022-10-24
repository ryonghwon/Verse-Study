import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import VerseEntity from '../entities/verse.entity'

@Service()
export default class VerseService {
  public getVerseById(id: number) {
    const query = dataSource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
      .where('verse.id = :id', { id })
    return query.getOne()
  }

  public getVerseList(search?: string, offset?: number, limit?: number) {
    const query = dataSource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
      .orderBy('verse.id', 'DESC')
    if (search !== undefined) {
      query.where('verse.name like :name', { name: `%${search}%` })
    }
    if (
      offset !== undefined &&
      typeof offset === 'number' &&
      offset > 0 &&
      limit !== undefined &&
      typeof limit === 'number' &&
      limit > 0
    ) {
      query.offset(offset)
      query.limit(limit)
    }
    return query.getMany()
  }

  public getVerseCount(search?: string) {
    const query = dataSource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
    if (search !== undefined) {
      query.where('verse.name like :name', { name: `%${search}%` })
    }
    return query.getCount()
  }
}
