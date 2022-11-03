import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeArticlesEntity from '../entities/typeArticles.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeArticlesService {
  public getTypeArticleById(id: number) {
    const query = dataSource
      .getRepository(TypeArticlesEntity)
      .createQueryBuilder('type_articles')
      .where('type_articles.id = :id', { id })
    return query.getOne()
  }

  public createTypeArticle(
    cover: PicturesEntity,
    title: string,
    overview: string,
    content: any
  ) {
    const typeArticle = new TypeArticlesEntity()
    typeArticle.cover = cover
    typeArticle.title = title
    typeArticle.overview = overview
    typeArticle.content = content
    return typeArticle.save()
  }

  public updateTypeArticle(
    id: number,
    cover: PicturesEntity,
    title: string,
    overview: string,
    content: any
  ) {
    return dataSource.getRepository(TypeArticlesEntity).update(id, {
      cover,
      title,
      overview,
      content
    })
  }

  public deleteTypeArticle(id: number) {
    return dataSource.getRepository(TypeArticlesEntity).delete(id)
  }
}
