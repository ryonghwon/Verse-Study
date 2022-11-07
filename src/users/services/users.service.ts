import { Brackets } from 'typeorm'
import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import UsersEntity from '../entities/users.entity'
import {passwordHash} from "../../utils/passwordHash";

@Service()
export default class UsersService {
  public getUserById(id: number) {
    // return dataSource.getRepository(UsersEntity).findOne({ where: { id }})
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
      // .where('users.id = :id', { id })
      .where({ id })
    return query.getOne()
  }

  public getUserByIdWithActiveStatus(id: number) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
      .where({ id })
      .andWhere({ status: UsersEntity.STATUS.ACTIVE })
    return query.getOne()
  }

  public getUsersList(search?: string, offset?: number, limit?: number) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
      .orderBy('users.id', 'DESC')
      .where({ status: UsersEntity.STATUS.ACTIVE })
    if (search !== undefined) {
      // query.andWhere('users.name like :name', { name: `%${search}%` })
      query.andWhere(
        new Brackets((qb) => {
          qb.where('users.name like :name', { name: `%${search}%` }).orWhere(
            'users.nickname like :nickname',
            { nickname: `%${search}%` }
          )
        })
      )
    }
    if (
      offset !== undefined &&
      typeof offset === 'number' &&
      offset >= 0 &&
      limit !== undefined &&
      typeof limit === 'number' &&
      limit >= 0
    ) {
      query.skip(offset)
      query.take(limit)
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

  public async login(id: string, password: string) {
    const query = dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('users')
    const user = await query.where({ user_id: id }).getOne()
    if (!user) {
      return Promise.reject('No such user_id.')
    }
    // if (user === undefined || user === null) {
    // }
    if (user.password === passwordHash(password)) {
      // return user
      return Promise.resolve(user)
    } else {
      return Promise.reject('Password not match.')
    }
  }

  public createUser(
    user_id: string,
    password: string,
    name: string,
    nickname?: string,
    email?: string
  ) {
    const user = new UsersEntity()
    user.user_id = user_id
    user.password = password
    user.name = name
    user.nickname = nickname
    user.email = email
    return user.save()
  }

  public updateUser(
    id: number,
    password: string,
    name: string,
    status: number,
    role: number,
    nickname?: string,
    email?: string
  ) {
    return dataSource.getRepository(UsersEntity).update(id, {
      password,
      name,
      status,
      role,
      nickname,
      email
    })
  }

  public removeUser(user: UsersEntity) {
    return dataSource.getRepository(UsersEntity).remove(user)
  }

  public withdrawUser(id: number) {
    return dataSource.getRepository(UsersEntity).update(id, {
      status: UsersEntity.STATUS.WITHDRAW
    })
  }
}
