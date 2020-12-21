import { IncomingMessage } from 'http'
import { Utils } from '../../app/Utils/Utils'

describe('Utils test suite', () => {
  test('getRequestPath valid request', () => {
    const request = {
      url: 'http://localhost:8080/login'
    } as IncomingMessage

    const resultPath = Utils.getRequestBasePath(request)
    expect(resultPath).toBe('login')
  })

  test('getRequestPath request path with no path name', () => {
    const request = {
      url: 'http://localhost:8080/'
    } as IncomingMessage

    const resultPath = Utils.getRequestBasePath(request)
    expect(resultPath).toBeFalsy()
  })

  test('getRequestPath request path with empty string', () => {
    const request = {
      url: 'http://localhost:8080/'
    } as IncomingMessage

    const resultPath = Utils.getRequestBasePath(request)
    expect(resultPath).toBeFalsy()
  })
})