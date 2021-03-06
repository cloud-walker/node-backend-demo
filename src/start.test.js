import { startServer } from './start'
import supertest from 'supertest'
import logger from 'loglevel'

const port = 3002
let server

beforeEach(async () => {
  server = await startServer({ port })
})

afterEach(async () => {
  await server.close()
})

describe('StartServer', () => {
  it('should return the pong', async () => {
    const res = await supertest(server).get('/ping/success')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('pong')
  })

  it('should return the test error', async () => {
    const originaLoggerError = logger.error
    logger.error = jest.fn()
    const res = await supertest(server).get('/ping/error')
    const string = JSON.stringify({ message: 'forced error' })
    expect(logger.error).toHaveBeenCalledWith(
      'server error:',
      new Error(string)
    )
    expect(res.status).toBe(500)
    expect(res.text).toBe(string)
    logger.error = originaLoggerError
  })
})
