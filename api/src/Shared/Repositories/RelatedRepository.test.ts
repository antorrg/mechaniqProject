import { beforeAll, afterAll, describe, it, expect} from 'vitest'
import {startUp, closeDatabase, User, Car} from '../../Configs/seqDb.ts'
import {RelatedRepository} from './RelatedRepository.ts'
import * as help from './sequelizeHelper.help.ts'
import * as store from '../../../test/helpers/testStore.help.ts'



describe('RelatedRepository unit test', () => {
    beforeAll(async()=>{
        await startUp(true, true)
        await help.createSeedRelatedElements(User,help.usersSeed, Car, help.cars, 'UserId')
    })
    afterAll(async()=>{
    await closeDatabase()
    })
    const test = new RelatedRepository(User, help.relatedParser, 'email', Car, 'licensePlate')

    describe('Get methods', () => {
        describe('"getAll" method', () => {
        it('should retrieve an array of elements', async() => {
            const response = await test.getAll()
            expect(response.message).toBe('User records retrieved successfully')
            expect(response.results.length).toBe(15)
            store.setStringId(response.results[0].id)
            expect(response.results[0]).toEqual({
                id: expect.any(String),
                email: 'user1@email.com',
                password: '123456',
                nickname: 'userTest1',
                typeId: 'dni',
                numberId:'12345678',
                username: 'One',
                picture: 'https://picsum.photos/200?random=1',
                enabled: true,
                cars: [{
                    id: expect.any(String),
                    patent: 'AB123CD'
                }]
            
            })
        })
        it('Should retrieve an array of elements filtered by query', async() => {
             const response = await test.getAll('false', 'enabled')
            expect(response.message).toBe('User records retrieved successfully')
            expect(response.results.length).toBe(3)
        })
        })
        describe('"getById" method', () => { 
            it('Should retrieve an element by Id', async() => {
             const response = await test.getById(store.getStringId())
            expect(response.message).toBe('User record retrieved successfully')
            expect(response.results).toEqual({
                id: expect.any(String),
                email: 'user1@email.com',
                password: '123456',
                nickname: 'userTest1',
                typeId: 'dni',
                numberId:'12345678',
                username: 'One',
                picture: 'https://picsum.photos/200?random=1',
                enabled: true,
                cars: [{
                    id: expect.any(String),
                    patent: 'AB123CD'
                }]
            })
          })
        })
        describe('"getByField" method', () => { 
            it('Should retrieve an element by field', async() => {
             const response = await test.getByField("user15@email.com", 'email')
            expect(response.message).toBe('User record retrieved successfully')
            expect(response.results).toEqual({
                id: expect.any(String),
                email: "user15@email.com",
                password: "123456",
                nickname: "userTest15",
                typeId: 'dni',
                numberId:'12345678',
                username: "Fifteen",
                picture: "https://picsum.photos/200?random=15",
                enabled: false,
                cars:[{
                    id: expect.any(String),
                    patent: 'CD345EF'
                }]
            })
            
        })
      })
      describe('"getWithPages" method', () => { 
         it('Should retrieve an array of paginated elements', async() => {
            const queryObject = {page:1, limit:10,}
             const response = await test.getWithPages(queryObject)
            expect(response.message).toBe('Total records: 15. Users retrieved successfully')
            expect(response.info).toEqual({ total: 15, page: 1, limit: 10, totalPages: 2 })
            expect(response.data.length).toBe(10)
             expect(response.data.map(a => a.username)).toEqual(["One","Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"])// Order
        })
         it('Should retrieve filtered and sorted elements', async() => {
            const queryObject = {page:1, limit:10,query:{enabled: false}, order: { username : 'ASC'}} as const
             const response = await test.getWithPages(queryObject)
            expect(response.message).toBe('Total records: 3. Users retrieved successfully')
            expect(response.info).toEqual({ total: 3, page: 1, limit: 10, totalPages: 1 })
            expect(response.data.length).toBe(3)
            expect(response.data.map(a => a.username)).toEqual(["Fifteen", "Seven", "Six"])// Order
        })
      })

    })

})
