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

  public getVerseList() {}

  public getVerseCount() {
    const query = dataSource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
    return query.getCount()
  }
}
