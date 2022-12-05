import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import PostsEntity from '../entities/posts.entity'
import PicturesEntity from '../../common/entities/pictures.entity'
import CityEntity from '../entities/city.entity'
import TypeImagesEntity from '../entities/typeImages.entity'
import TypeVideosEntity from '../entities/typeVideos.entity'
import TypeArticlesEntity from '../entities/typeArticles.entity'

@Service()
export default class PostsService {
  public getPostById(id: number, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .leftJoinAndSelect('posts.city', 'city')
      .leftJoinAndSelect('posts.image_content', 'image_content')
      .leftJoinAndSelect('image_content.image', 'image_content.image')
      .leftJoinAndSelect('posts.video_content', 'video_content')
      .leftJoinAndSelect('video_content.poster', 'video_content.poster')
      .leftJoinAndSelect('posts.article_content', 'article_content')
      .leftJoinAndSelect('article_content.cover', 'article_content.cover')
      .select([
        'posts.id',
        'posts.type',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'city.id',
        'city.name',
        'image_content.id',
        'image_content.title',
        'image_content.description',
        // 'image_content.image',
        'image_content.image.id',
        'image_content.image.url',
        'video_content.id',
        'video_content.video_id',
        'video_content.title',
        'video_content.description',
        // 'video_content.poster',
        'video_content.poster.id',
        'video_content.poster.url',
        'article_content.id',
        // 'article_content.cover',
        'article_content.cover.id',
        'article_content.cover.url',
        'article_content.title',
        'article_content.overview',
        'article_content.content',
        'posts.published_at',
        'posts.status'
      ])
      .where({ id })
      .andWhere('posts.status IN(:status)', { status })
    return query.getOne()
  }

  public getPreviousPostById(id: number, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .select([
        'posts.id',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'posts.published_at'
      ])
      .where('posts.id < :id', { id })
      .andWhere('posts.status IN(:status)', { status })
    return query.getOne()
  }

  public getNextPostById(id: number, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .select([
        'posts.id',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'posts.published_at'
      ])
      .where('posts.id > :id', { id })
      .andWhere('posts.status IN(:status)', { status })
    return query.getOne()
  }

  public getPreviousPostByIdAfterOrderByPublishedAt(id: number, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .select([
        'posts.id',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'posts.published_at'
      ])
      .where('posts.id < :id', { id })
      .andWhere('posts.status IN(:status)', { status })
      .orderBy('posts.published_at', 'DESC')
    return query.getOne()
  }

  public getNextPostByIdAfterOrderByPublishedAt(id: number, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .select([
        'posts.id',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'posts.published_at'
      ])
      .where('posts.id > :id', { id })
      .andWhere('posts.status IN(:status)', { status })
      .orderBy('posts.published_at', 'DESC')
    return query.getOne()
  }

  public getPostsList(
    search?: string,
    offset?: number,
    limit?: number,
    status = [PostsEntity.STATUS.PUBLIC]
  ) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.thumbnail', 'thumbnail')
      .leftJoinAndSelect('posts.city', 'city')
      .select([
        'posts.id',
        'posts.type',
        'posts.title',
        'thumbnail.id',
        'thumbnail.url',
        'city.id',
        'city.name',
        'posts.published_at'
      ])
      .where('posts.status IN(:status)', { status })
    if (search !== undefined) {
      query.andWhere('posts.title like :title', { title: `%${search}%` })
    }
    query
      // .orderBy('posts.id', 'DESC')
      .orderBy('posts.published_at', 'DESC')
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

  public getPostsCount(search?: string, status = [PostsEntity.STATUS.PUBLIC]) {
    const query = dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .where('posts.status IN(:status)', { status })
    if (search !== undefined) {
      query.andWhere('posts.title like :title', { title: `%${search}%` })
    }
    return query.getCount()
  }

  public createPost(
    type: string,
    thumbnail: PicturesEntity,
    title: string,
    city: CityEntity,
    image_content: TypeImagesEntity,
    video_content: TypeVideosEntity,
    article_content: TypeArticlesEntity
  ) {
    const post = new PostsEntity()
    post.type = type
    post.thumbnail = thumbnail
    post.title = title
    post.city = city
    post.image_content = image_content
    post.video_content = video_content
    post.article_content = article_content
    return post.save()
  }

  public updatePost(
    id: number,
    type: string,
    thumbnail: PicturesEntity,
    title: string,
    city: CityEntity,
    image_content: TypeImagesEntity,
    video_content: TypeVideosEntity,
    article_content: TypeArticlesEntity,
    published_at: Date,
    status: string
  ) {
    return dataSource.getRepository(PostsEntity).update(id, {
      type,
      thumbnail,
      title,
      city,
      image_content,
      video_content,
      article_content,
      published_at,
      status
    })
  }

  public deletePost(id: number) {
    return dataSource.getRepository(PostsEntity).delete(id)
  }
}
