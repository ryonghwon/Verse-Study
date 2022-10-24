import { Service } from 'typedi'
import { dataSource } from '../../dataSource'
import TypeArticlesEntity from '../entities/typeArticles.entity'

@Service()
export default class TypeArticlesService {
  public getTypeArticleById(id: number) {
    const query = dataSource
      .getRepository(TypeArticlesEntity)
      .createQueryBuilder('type_articles')
      .where('type_articles.id = :id', { id })
    return query.getOne()
  }
}
