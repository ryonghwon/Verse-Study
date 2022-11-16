import { Router, Request, Response } from 'express'
import { Container } from 'typedi'
import RequestService from '../../../request/services/request.service'
import { APIErrorResult, APIResult } from '../APIResult'
import APIUtils from '../../../utils/APIUtils'

const router = Router()

const COUNT_PER_PAGE = 20

// ?page=1
router.get('/requests/list', async (req: Request, res: Response) => {
  const page =
    req.query.page !== undefined
      ? APIUtils.numberOrThrow(Number(req.query.page))
      : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const requestsService = Container.get(RequestService)
  try {
    const requests = await requestsService.getRequestList(
      undefined,
      offset,
      COUNT_PER_PAGE
    )
    console.log(`Request List : ${requests}`)
    const total = await requestsService.getRequestCount()
    console.log(`Total Count : ${total}`)
    return res.json(APIResult({ requests, total, page }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// { name: '', email: '', phone: '', company: '', message: '' }
router.get('/request/new', async (req: Request, res: Response) => {
  let { name, email, phone, company, message } = req.body
  // name 유효성 검증.
  // name 이 없거나, 빈 값.
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a name.'))
  }
  // email 유효성 검증.
  // email 이 없거나, 빈 값.
  if (email === undefined || email.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a email.'))
  }
  // phone 유효성 검증.
  // phone 이 없거나, 빈 값.
  if (phone === undefined || phone.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a phone.'))
  }
  // message 유효성 검증.
  // message 이 없거나, 빈 값.
  if (message === undefined || message.trim() === '') {
    return res.status(500).json(APIErrorResult('Please enter a message.'))
  }
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.createRequest(
      name,
      email,
      phone,
      message,
      company
    )
    console.log(`Create Request : ${request}`)
    return res.json(APIResult({ id: request.id }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:request_id
router.get('/request/:request_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.request_id))
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.getRequestById(id)
    console.log(`Get Request : ${request}`)
    if (request !== undefined && request !== null) {
      return res.json(APIResult({ request }))
    }
    return res.status(500).json(APIErrorResult('Request not found.'))
    // return res.status(500).json(APIErrorResult('Request를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:request_id
router.delete('/request/:request_id', async (req: Request, res: Response) => {
  const id = APIUtils.numberOrThrow(Number(req.params.request_id))
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.deleteRequest(id)
    console.log(`Delete Request : ${request}`)
    return res.json(APIResult({ result: true }))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router
