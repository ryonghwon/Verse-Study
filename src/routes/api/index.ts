import { Application } from 'express'
import posts from './specs/posts'
// import request from './specs/request'

export default class APIRouter {
  public routes(basePath: string, app: Application) {
    app.use(basePath, posts)
    // app.use(basePath, request)
  }
}
