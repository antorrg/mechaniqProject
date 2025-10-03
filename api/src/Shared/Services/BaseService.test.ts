import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase, User } from '../../Configs/seqDb.ts'
import { SequelizeRepository } from '../Repositories/SequelizeRepository.ts'
import * as help from '../Repositories/sequelizeHelper.help.ts'
import * as store from '../../../test/helpers/testStore.help.ts'
import prepareTestImages from '../../../test/helpers/prepareTestImages.ts'
import { BaseService } from './BaseService.ts'
import ImgsService from './ImgsService.ts'

describe('BaseService unit test', () => {
  let imagesCopied: string[] = []
  beforeAll(async () => {
    await startUp(true, true)
    imagesCopied = await prepareTestImages(2)
  })
  afterAll(async () => {
    await closeDatabase()
  })
  const repo = new SequelizeRepository(User, help.parser, 'email')
  const test = new BaseService(repo, ImgsService, true, 'picture')
  describe('Create method', () => {
    it('should create a element', async () => {
      const response = await test.create({ ...help.dataCreate, picture: imagesCopied[0] })
      expect(response.message).toBe('User user@email.com created successfully')
      expect(response.results).toEqual({
        id: expect.any(String),
        email: 'user@email.com',
        password: '123456',
        nickname: 'userTest',
        typeId: 'dni',
        numberId: '12345678',
        username: 'user',
        picture: imagesCopied[0],
        role: 'Usuario',
        enabled: true
      })
      store.setStringId(response.results.id)
    })
  })
  describe('Get methods', () => {
    describe('"getAll" method', () => {
      it('should retrieve an array of elements', async () => {
        await help.createSeedRandomElements(User, help.usersSeed)
        const response = await test.getAll()
        expect(response.message).toBe('User records retrieved successfully')
        expect(response.results.length).toBe(16)
      })
      it('Should retrieve an array of elements filtered by query', async () => {
        const response = await test.getAll('false', 'enabled')
        expect(response.message).toBe('User records retrieved successfully')
        expect(response.results.length).toBe(3)
      })
    })
    describe('"getById" method', () => {
      it('Should retrieve an element by Id', async () => {
        const response = await test.getById(store.getStringId())
        expect(response.message).toBe('User record retrieved successfully')
        expect(response.results).toEqual({
          id: expect.any(String),
          email: 'user@email.com',
          password: '123456',
          nickname: 'userTest',
          typeId: 'dni',
          numberId: '12345678',
          username: 'user',
          picture: imagesCopied[0],
          role: 'Usuario',
          enabled: true
        })
      })
    })
    describe('"getByField" method', () => {
      it('Should retrieve an element by field', async () => {
        const response = await test.getByField('user15@email.com', 'email')
        expect(response.message).toBe('User record retrieved successfully')
        expect(response.results).toEqual({
          id: expect.any(String),
          email: 'user15@email.com',
          password: '123456',
          nickname: 'userTest15',
          typeId: 'dni',
          numberId: '12345678',
          username: 'Fifteen',
          picture: 'https://picsum.photos/200?random=15',
          role: 'Usuario',
          enabled: false
        })
      })
    })
    describe('"getWithPages" method', () => {
      it('Should retrieve an array of paginated elements', async () => {
        const queryObject = { page: 1, limit: 10 }
        const response = await test.getWithPages(queryObject)
        expect(response.message).toBe('Total records: 16. Users retrieved successfully')
        expect(response.info).toEqual({ total: 16, page: 1, limit: 10, totalPages: 2 })
        expect(response.data.length).toBe(10)
        expect(response.data.map(a => a.username)).toEqual(['user', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'])// Order
      })
      it('Should retrieve filtered and sorted elements', async () => {
        const queryObject = { page: 1, limit: 10, query: { enabled: false }, order: { username: 'ASC' } } as const
        const response = await test.getWithPages(queryObject)
        expect(response.message).toBe('Total records: 3. Users retrieved successfully')
        expect(response.info).toEqual({ total: 3, page: 1, limit: 10, totalPages: 1 })
        expect(response.data.length).toBe(3)
        expect(response.data.map(a => a.username)).toEqual(['Fifteen', 'Seven', 'Six'])// Order
      })
    })
  })
  describe('Update method', () => {
    it('should update an element', async () => {
      const data = { name: 'Name of user', picture: imagesCopied[1] }
      const response = await test.update(store.getStringId(), data)
      expect(response.results).toEqual({
        id: expect.any(String),
        ...help.dataUpdate,
        picture: imagesCopied[1]
      })
    })
  })
  describe('Delete method', () => {
    it('should deleted an element', async () => {
      const response = await test.delete(store.getStringId())
      expect(response.message).toBe('user@email.com deleted successfully and Image assets/uploads/test1.jpg deleted successfully')
    })
  })
})
