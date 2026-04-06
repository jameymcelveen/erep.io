import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('strips trailing slash from VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8080/')
    vi.resetModules()
    const { getApiBaseUrl } = await import('../../web/src/lib/api-base')
    expect(getApiBaseUrl()).toBe('http://localhost:8080')
  })
})
