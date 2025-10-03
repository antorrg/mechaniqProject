import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.ts'
import { startUp, closeDatabase, User, Car, Service } from './seqDb.ts'

describe('EnvDb test', () => {
  beforeAll(async () => {
    await startUp(true, true)
  })
  afterAll(async () => {
    await closeDatabase()
  })
  describe('Environment variables', () => {
    it('should return the correct environment status and database variable', () => {
      const formatEnvInfo =
      `Server running in: ${envConfig.Status}\n` +
      `Testing sequelize database: ${envConfig.DatabaseUrl}`
      expect(formatEnvInfo).toBe(
        'Server running in: test\n' + 'Testing sequelize database: postgres://postgres:antonio@localhost:5432/testing'
      )
    })
  })
  describe('Sequelize database', () => {
    it('should query tables and return an empty array', async () => {
      const models = [User, Car, Service]
      for (const model of models) {
        const records = await model.findAll()
        expect(Array.isArray(records)).toBe(true)
        expect(records.length).toBe(0)
      }
    })
  })
})
