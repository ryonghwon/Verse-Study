import { Router, Request, Response } from 'express'
import { Container } from 'typedi'
import UsersService from '../../../users/services/users.service'
import { APIErrorResult, APIResult } from '../APIResult'
import APIUtils from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

// ?page=1
router.get('/users/list', async (req: Request, res: Response) => {
  const page =
    req.query.page !== undefined
      ? APIUtils.numberOrThrow(Number(req.query.page))
      : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const usersService = Container.get(UsersService)
  try {
    const users = await usersService.getUsersList(
      undefined,
      offset,
      COUNT_PER_PAGE
    )
    console.log(`Users List : ${users}`)
    const total = await usersService.getUsersCount()
    console.log(`Total Users : ${users}`)
    return res.json(APIResult({ users, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// { user_id: '', password: '', name: '', nickname: '', email: '' }
router.post('/user/create', async (req: Request, res: Response) => {
  const { user_id, password, name, nickname, email } = req.body
  if (user_id === undefined || user_id.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a user id.'))
    // return res.status(500).json(APIErrorResult('user id를 입력해주세요.'))
  }
  if (password === undefined || password.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a password.'))
    // return res.status(500).json(APIErrorResult('password를 입력해주세요.'))
  }
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a name.'))
    // return res.status(500).json(APIErrorResult('name을 입력해주세요.'))
  }
  const usersService = Container.get(UsersService)
  try {
    const user = await usersService.createUser(user_id, password, name, nickname, email)
    console.log(`Create User : ${user}`)
    return res.json(APIResult({ id: user.id }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:user_id
router.get('/user/:user_id',  async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UsersService)
  try {
    const user = await usersService.getUserByIdWithActiveStatus(id)
    console.log(`Get User : ${user}`)
    if (user !== undefined && user !== null) {
      return res.json(APIResult({ user }))
    }
    return res.status(500).json(APIErrorResult('User not found.'))
    // return res.status(500).json(APIErrorResult('User를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:user_id
router.delete('/user/:user_id',  async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UsersService)
  try {
    const user = await usersService.getUserById(id)
    await usersService.removeUser(user)
    return res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:user_id
router.patch('/user/withdraw/:user_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UsersService)
  try {
    const user = await usersService.getUserById(id)
    if (user !== undefined && user !== null) {
      if (user.status === 0) {
        await usersService.withdrawUser(id)
        return res.json(APIResult({ result: true }))
      }
      return res.status(500).json(APIErrorResult('User has already withdraw.'))
      // return res.status(500).json(APIErrorResult('이미 탈퇴한 User입니다.'))
    }
    return res.status(500).json(APIErrorResult('User not found.'))
    // return res.status(500).json(APIErrorResult('User를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router
