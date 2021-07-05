import { readFile } from 'fs'
import { resolve as rs } from 'path'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
  const html = await new Promise<string>((resolve, reject) => {
    readFile(rs('./__mocks__/webpage.html'), { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
  const response = { text: async () => html, ok: !/error/.test(url as string) } as Response
  return response
}

export default fetch
