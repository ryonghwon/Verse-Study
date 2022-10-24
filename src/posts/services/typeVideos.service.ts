import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeVideosEntity from '../entities/typeVideos.entity'

@Service()
export default class TypeVideosService {
  public getTypeVideoById(id: number) {
    const query = dataSource
      .getRepository(TypeVideosEntity)
      .createQueryBuilder('type_videos')
      .where('type_videos.id = :id', { id })
    return query.getOne()
  }
}
