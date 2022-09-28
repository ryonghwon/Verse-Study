import {Router, Request, Response } from 'express'

const router = Router()

router.get('/archive', (req: Request, res: Response) => {
  res.render('www/archive')
})

router.get('/post/:id', (req: Request, res: Response) => {
  res.render('www/post')
})

export default router