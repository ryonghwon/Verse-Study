import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeVideosEntity from '../entities/typeVideos.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeVideosService {
  public getTypeVideoById(id: number) {
    const query = dataSource
      .getRepository(TypeVideosEntity)
      .createQueryBuilder('type_videos')
      .leftJoinAndSelect('type_videos.poster', 'poster')
      /*-- 학습을 위한 select() --*/
      // .select([
      //   'type_videos.video_id',
      //   'type_videos.poster',
      //   'type_videos.title',
      //   'type_videos.description',
      //   'poster.id',
      //   'poster.url'
      // ])
      .where({ id })
    return query.getOne()
  }

  public createTypeVideo(
    video_id: string,
    poster: PicturesEntity,
    title: string,
    description: string
  ) {
    const typeVideo = new TypeVideosEntity()
    typeVideo.video_id = video_id
    typeVideo.poster = poster
    typeVideo.title = title
    typeVideo.description = description
    return typeVideo.save()
  }

  public updateTypeVideo(
    id: number,
    video_id: string,
    poster: PicturesEntity,
    title: string,
    description: string
  ) {
    return dataSource.getRepository(TypeVideosEntity).update(id, {
      video_id,
      poster,
      title,
      description
    })
  }

  public deleteTypeVideo(id: number) {
    return dataSource.getRepository(TypeVideosEntity).delete(id)
  }
}
