import {Router, Request, Response } from 'express'

const router = Router()

router.get('/archive', (req: Request, res: Response) => {
  res.render('admin/posts/list_posts')
})

router.get('/post/:id', (req: Request, res: Response) => {
  res.render('admin/posts/view_posts')
})

router.get('/post/new', (req: Request, res: Response) => {
  res.render('admin/posts/form_posts')
})

router.get('/post/edit/:id', (req: Request, res: Response) => {
  res.render('admin/posts/form_posts')
})

export default router