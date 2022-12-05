import { Application } from 'express'

import main from './pages/main'
import posts from './pages/posts'
import contact from './pages/contact'
import accounts from './pages/accounts'

export default class AdminRouter {
  public routes(basePath: string, app: Application) {
    app.use(basePath, main)
    app.use(basePath, posts)
    app.use(basePath, contact)
    app.use(basePath, accounts)
  }
}
