import { Router, Request, Response } from 'express'
import { Container } from 'typedi'
import CityService from '../../../posts/services/city.service'
import { APIErrorResult, APIResult } from '../APIResult'
import APIUtils from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

// ?page=1 -> query
router.get('/city/list', async (req: Request, res: Response) => {
  // const page = req.query.page
  // const { page } = req.query
  const page =
    req.query.page !== undefined
      ? APIUtils.numberOfThrow(Number(req.query.page))
      : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const cityService = Container.get(CityService)
  try {
    const city = await cityService.getCityList(offset, COUNT_PER_PAGE)
    const total = await cityService.getCityCount()
    return res.json(APIResult({ city, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// { name: '' }
router.post('/city/create', async (req: Request, res: Response) => {
  const { name } = req.body
  // name 유효성 검증.
  // name 이 없거나, 빈 값.
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a name.'))
    // return res.status(500).json(APIErrorResult('name을 입력해주세요.'))
  }
  // 이미 존재하는 city 항목이 있는 경우.
  const cityService = Container.get(CityService)
  const existCity = await cityService.getCityByName(name)
  if (existCity !== undefined && existCity !== null) {
    return res.status(500).json(APIErrorResult('The city already exists.'))
    // return res.status(500).json(APIErrorResult('City가 이미 존재합니다.'))
  }
  try {
    const city = await cityService.createCity(name)
    return res.json(APIResult({ id: city.id }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:city_id -> params
router.get('/city/:city_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOfThrow(Number(req.params.city_id))
  const cityService = Container.get(CityService)
  try {
    const city = await cityService.getCityById(id)
    console.log(city)
    if (city !== undefined && city !== null) {
      return res.json(APIResult({ city }))
    }
    return res.status(500).json(APIErrorResult('City not found.'))
    // return res.status(500).json(APIErrorResult('City를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:city_id
// { name: '' }
router.patch('/city/:city_id', async (req: Request, res: Response) => {
  const { name } = req.body
  const id = APIUtils.numberOfThrow(Number(req.params.city_id))
  // name 유효성 검증.
  // name 이 없거나, 빈 값.
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a name.'))
    // return res.status(500).json(APIErrorResult('name을 입력해주세요.'))
  }
  // 이미 존재하는 city 항목이 있는 경우.
  const cityService = Container.get(CityService)
  const existCity = await cityService.getCityByName(name)
  // 자기 자신의 id 가 동일한 경우는 통과.
  if (existCity !== undefined && existCity !== null && existCity.id !== id) {
    return res.status(500).json(APIErrorResult('The same city exists.'))
    // return res.status(500).json(APIErrorResult('같은 City가 존재합니다.'))
  }
  try {
    const city = await cityService.updateCity(id, name)
    console.log(city)
    return res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.delete('/city/:city_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOfThrow(Number(req.params.city_id))
  const cityService = Container.get(CityService)
  try {
    const city = await cityService.deleteCity(id)
    console.log(city)
    return res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router
