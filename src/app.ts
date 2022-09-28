import express, { Application, Request, Response, NextFunction } from 'express'

require('express-async-errors')
import compression from 'compression'
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import config from '../config'
import { APIError } from './routes/api/APIResult'
import APIRouter from './routes/api'
import WWWRouter from './routes/www'
import AdminRouter from './routes/admin'

class App {
  public app: Application
  public APP_SECRET = config.APP_SECRET
  public static PROJECT_DIR = config.PROJECT_DIR

  constructor() {
    this.app = express()
  }

  public setup() {
    this.config()
    this.setupRoutes()
  }

  private config() {
    this.app.use(compression())

    this.app.set('views', path.join(config.PROJECT_DIR, 'views'))
    this.app.set('view engine', 'ejs')

    this.app.use(morgan('combined'))

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser(this.APP_SECRET))
    this.app.use(express.static(path.join(config.PROJECT_DIR, 'public')))
  }

  private setupRoutes() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.url = req.originalUrl
      res.locals.host = req.get('host')
      res.locals.protocol = req.protocol
      next()
    })

    // Routes.
    new APIRouter().routes('/api', this.app)
    new WWWRouter().routes('/', this.app)
    new AdminRouter().routes('/admin', this.app)

    this.app.use((req: express.Request, res: express.Response) => {
      res.render('www/error/notfound')
    })

    this.app.use((err: any, req: Request, res: Response) => {
      // API 오류 json / WEB 오류 Not found, 404 ejs
      if (
        err instanceof APIError ||
        (err instanceof Error && req.path.startsWith('/api/'))
      ) {
        App.handleApiError(err, req, res)
      } else {
        App.handleWebError(err, req, res)
      }
    })
  }

  private static handleApiError(err: any, _: Request, res: Response): void {
    res.status(err.status ? err.status : 500).json({
      success: false,
      code: err.code ? err.code : 500,
      message: err.message
    })
  }

  private static handleWebError(err: any, req: Request, res: Response) {
    res.locals.message = err.message
    // res.locals.error = req.app.get('env') === 'development' ? err: {}
    res.locals.error = err
    res.status(err.status || 500)
    res.render('www/error/notfound')
  }
}

export default App
