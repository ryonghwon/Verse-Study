import { Router, Request, Response } from 'express'
import { Container } from 'typedi'
import PostsEntity from '../../../posts/entities/posts.entity'
import PostsService from '../../../posts/services/posts.service'
import {APIErrorResult, APIResult} from '../APIResult'
import APIUtils from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

// ?page=1
router.get('/posts/list', async (req: Request, res: Response) => {
  const page =
    req.query.page !== undefined
      ? APIUtils.numberOrThrow(Number(req.query.page))
      : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const postsService = Container.get(PostsService)
  try {
    const posts: PostsEntity[] = await postsService.getPostsList(
      undefined,
      offset,
      COUNT_PER_PAGE
    )
    console.log(`Posts List : ${posts}`)
    const total = await postsService.getPostsCount()
    console.log(`Total Count : ${total}`)
    return res.json(APIResult({ posts, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.post('/post/create', (req: Request, res: Response) => {
  return
})

router.get('/post/:post_id', (req: Request, res: Response) => {
  return
})

router.patch('/post/:post_id', (req: Request, res: Response) => {
  return
})

router.delete('/post/:post_id', (req: Request, res: Response) => {
  return
})

export default router
