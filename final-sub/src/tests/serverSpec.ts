import app from '../server'
import supertest from 'supertest'

describe('Test the root path', () => {
  it('should return hello world!', async () => {
    const response = await supertest(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World!')
  })
})
