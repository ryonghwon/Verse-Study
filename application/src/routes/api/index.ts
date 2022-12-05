import { Application } from 'express'
import pictures from './specs/pictures'
import users from './specs/users'
import city from './specs/city'
import posts from './specs/posts'
import request from './specs/request'

export default class APIRouter {
  public routes(basePath: string, app: Application) {
    app.use(basePath, pictures)
    app.use(basePath, users)
    // app.use(`${basePath}/city`, city)
    app.use(basePath, city)
    app.use(basePath, posts)
    app.use(basePath, request)
  }
}
