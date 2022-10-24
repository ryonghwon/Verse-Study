import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import UsersEntity from '../entities/users.entity'

@Service()
export default class UsersService {
  public getUserById(id: number) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
    return query.getOne()
  }

  public getUsersList(search?: string, offset?: number, limit?: number) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
      .orderBy('users.id', 'DESC')
    if (search !== undefined) {
      query.where('users.name like :name', { name: `%${search}%` })
    }
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

  public getUsersCount(search?: string) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
    if (search !== undefined) {
      query.where('users.name like :name', { name: `%${search}%` })
    }
    return query.getCount()
  }
}
