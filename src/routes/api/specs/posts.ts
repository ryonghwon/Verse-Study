import { Router, Request, Response } from 'express'
import moment from 'moment'
import { Container } from 'typedi'
import PostsEntity from '../../../posts/entities/posts.entity'
import PicturesService from '../../../common/services/pictures.service'
import CityService from '../../../posts/services/city.service'
import TypeImagesService from '../../../posts/services/typeImages.service'
import TypeVideosService from '../../../posts/services/typeVideos.service'
import TypeArticlesService from '../../../posts/services/typeArticles.service'
import PostsService from '../../../posts/services/posts.service'
import { APIErrorResult, APIResult } from '../APIResult'
import APIUtils from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

enum CONTENT_TYPE {
  PARAGRAPH = 'paragraph',
  FIGURE = 'figure'
}

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

//  {
//    type: TYPE,
//    thumbnail: 1,
//    title: '',
//    city: 1,
//    image_content: 1 | null,
//    video_content: 1 | null,
//    article_content: 1 | null,
//    published_at: 111111111
//    status: STATUS
//  }
router.post('/post/create', async (req: Request, res: Response) => {
  const {
    type,
    thumbnail,
    title,
    city,
    image_content,
    video_content,
    article_content
  } = await setPostData(req.body)
  if (type === undefined) {
    return res.status(500).json(APIErrorResult('Please select a type.'))
    // return res.status(500).json(APIErrorResult('type 을 선택해주세요.'))
  }
  if (thumbnail === undefined || thumbnail === null) {
    return res
      .status(500)
      .json(APIErrorResult('Please upload a thumbnail image.'))
    // return res.status(500).json(APIErrorResult('thumbnail 이미지를 업로드 해주세요.'))
  }
  if (title === undefined || title.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a title.'))
    // return res.status(500).json(APIErrorResult('title 을 입력해주세요.'))
  }
  if (city === undefined || city === null) {
    return res.status(500).json(APIErrorResult('Please select a city.'))
    // return res.status(500).json(APIErrorResult('city 를 선택해주세요.'))
  }
  if (
    type === PostsEntity.TYPE.IMAGE &&
    (image_content === undefined || image_content === null)
  ) {
    return res.status(500).json(APIErrorResult('Please enter image content.'))
    // return res.status(500).json(APIErrorResult('image content 를 입력해주세요.'))
  }
  if (
    type === PostsEntity.TYPE.VIDEO &&
    (video_content === undefined || video_content === null)
  ) {
    return res.status(500).json(APIErrorResult('Please enter video content.'))
    // return res.status(500).json(APIErrorResult('video content 를 입력해주세요.'))
  }
  if (
    type === PostsEntity.TYPE.ARTICLE &&
    (article_content === undefined || article_content === null)
  ) {
    return res.status(500).json(APIErrorResult('Please enter article content.'))
    // return res.status(500).json(APIErrorResult('article content 를 입력해주세요.'))
  }
  const postsService = Container.get(PostsService)
  try {
    let _image_content = null
    let _video_content = null
    let _article_content = null
    if (type === PostsEntity.TYPE.IMAGE) {
      if (image_content !== undefined && image_content !== null) {
        const { image, title, description } = image_content
        const typeImagesService = Container.get(TypeImagesService)
        _image_content = await typeImagesService.createTypeImage(
          image,
          title,
          description
        )
        console.log('Create Type Image : ', _image_content)
      }
    }
    if (type === PostsEntity.TYPE.VIDEO) {
      if (video_content !== undefined && video_content !== null) {
        const { video_id, poster, title, description } = video_content
        const typeVideosService = Container.get(TypeVideosService)
        _video_content = await typeVideosService.createTypeVideo(
          video_id,
          poster,
          title,
          description
        )
        console.log('Create Type Video : ', _video_content)
      }
    }
    if (type === PostsEntity.TYPE.ARTICLE) {
      if (article_content !== undefined && article_content !== null) {
        const { cover, title, overview, content } = article_content
        const articlesService = Container.get(TypeArticlesService)
        _article_content = await articlesService.createTypeArticle(
          cover,
          title,
          overview,
          content
        )
        console.log('Create Type Article : ', _article_content)
      }
    }
    const post = await postsService.createPost(
      type,
      thumbnail,
      title,
      city,
      _image_content,
      _video_content,
      _article_content
    )
    console.log('Create Post : ', post)
    return res.json(APIResult({ id: post.id }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.get('/post/:post_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.post_id))
  const postsService = Container.get(PostsService)
  try {
    const post = await postsService.getPostById(id)
    if (post !== undefined && post !== null) {
      if (
        post.type === PostsEntity.TYPE.ARTICLE &&
        post.article_content !== undefined &&
        post.article_content !== null
      ) {
        const picturesService = Container.get(PicturesService)
        post.article_content.content = await Promise.all(
          post.article_content.content.map(async (item) => {
            const { type, image: image_id } = item
            console.log(type, item)
            if (type === CONTENT_TYPE.FIGURE) {
              const image = await picturesService.getPicture(image_id)
              return {
                ...item,
                image
              }
            }
            return item
          })
        )
      }
    }
    return res.json(APIResult({ post }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.patch('/post/:post_id', (req: Request, res: Response) => {
  return
})

router.delete('/post/:post_id', (req: Request, res: Response) => {
  return
})

export default router

const setPostData = async (body: any) => {
  const {
    type = PostsEntity.TYPE.IMAGE,
    thumbnail: thumbnail_id,
    title,
    city: city_id,
    image_content: image_content_data = null,
    video_content: video_content_data = null,
    article_content: article_content_data = null,
    published_at: published_at_unix = moment(),
    status = PostsEntity.STATUS.PRIVATE
  } = body
  const picturesService = Container.get(PicturesService)
  const thumbnail = await picturesService.getPicture(thumbnail_id)
  const cityService = Container.get(CityService)
  const city = await cityService.getCityById(city_id)
  let image_content = null
  let video_content = null
  let article_content = null
  if (image_content_data !== null) {
    const image = await picturesService.getPicture(image_content_data.image)
    image_content = {
      id: null,
      title: image_content_data.title,
      description: image_content_data.description,
      image
    }
  }
  if (video_content_data !== null) {
    const poster = await picturesService.getPicture(video_content_data.poster)
    video_content = {
      id: null,
      video_id: video_content_data.video_id,
      title: video_content_data.title,
      description: video_content_data.description,
      poster
    }
  }
  if (article_content_data !== null) {
    const cover = await picturesService.getPicture(article_content_data.cover)
    article_content = {
      id: null,
      cover,
      title: article_content_data.title,
      overview: article_content_data.overview,
      content: article_content_data.content
    }
  }
  const published_at = moment(published_at_unix).toDate()
  return {
    type,
    thumbnail,
    title,
    city,
    image_content,
    video_content,
    article_content,
    published_at,
    status
  }
}
