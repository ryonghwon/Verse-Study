import {Application} from 'express'

import main from './pages/main'
import posts from './pages/posts'
import contact from './pages/contact'

export default class WWWRouter {
  public routes(basePath: string, app: Application) {
    app.use(basePath, main)
    app.use(basePath, posts)
    app.use(basePath, contact)
  }
}