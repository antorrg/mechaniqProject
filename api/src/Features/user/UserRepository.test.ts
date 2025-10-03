import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase, User, Car } from '../../Configs/seqDb.ts'
import { UserRepository } from './UserRepository.ts'
import * as mapper from './userMappers.ts'
import * as store from '../../../test/helpers/testStore.help.ts'
import { getUserSeeds } from './userTest.help.ts'

describe('UserRepository unit test', () => {
  beforeAll(async () => {
    await startUp(true, true)
  })
  afterAll(async () => {
    await closeDatabase()
  })
  const test = new UserRepository(User, mapper.relatedParser, 'email', Car, 'licensePlate')
  describe('Login method', () => {
    it('should retrieve a user and a token with a valid password', async () => {
      const userSeeds = await getUserSeeds()
      for (const user of userSeeds) { await test.create(user) }

      const loginData = { email: 'user1@email.com', password: '1234567' }
      const response = await test.login(loginData)
      expect(response.message).toBe('Login successfully!')
      expect(response.results.token).toEqual(expect.any(String))
      expect(response.results.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
      expect(response.results.token!.length).toBeGreaterThan(200)
      expect(response.results.user).toEqual({
        id: expect.any(String),
        email: 'user1@email.com',
        nickname: 'userTest1',
        typeId: 'dni',
        numberId: '12345678',
        role: 'Usuario',
        username: 'One',
        picture: 'https://picsum.photos/200?random=1',
        enabled: true,
        cars: []
      })
      store.setStringId(response.results.user.id)
    })
    it('should throw an error if the user is blocked (enabled = false)', async () => {
      const loginData = { email: 'user2@email.com', password: '1234567' }
      try {
        await test.login(loginData)
        throw new Error('Expected a login error but nothing happenned')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(400)
        expect(error.message).toBe('User blocked')
      }
    })
    it('should throw an error if the password is invalid', async () => {
      const loginData = { email: 'user1@email.com', password: '123987' }
      try {
        await test.login(loginData)
        throw new Error('Expect a login error but nothing happenned')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(400)
        expect(error.message).toBe('Invalid password')
      }
    })
  })
  describe('VerifyPassword method', () => {
    it('should return a success message and update the user password when verification passes', async () => {
      const verifyData = { id: store.getStringId(), password: '1234567', newPassword: 'lld5594' }
      const response = await test.verifyPassword(verifyData)
      expect(response.message).toBe('User updated successfully')
      expect(response.results).toEqual({
        id: expect.any(String),
        email: 'user1@email.com',
        nickname: 'userTest1',
        typeId: 'dni',
        numberId: '12345678',
        role: 'Usuario',
        username: 'One',
        picture: 'https://picsum.photos/200?random=1',
        enabled: true,
        cars: []
      })
    })
    it('should throw an error if the current password is invalid', async () => {
      const verifyData = { id: store.getStringId(), password: '1234567', newPassword: 'lld5594' }
      try {
        await test.verifyPassword(verifyData)
        throw new Error('Expected a verifypassword error but nothing happenned')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(400)
        expect(error.message).toBe('Invalid password')
      }
      })
    it('should throw an error if the user has a Root role', async () => {
        const login = await test.login({ email: 'user3@email.com', password:'1234567'})
          store.setStringAdminId(login.results.user.id)
        const verifyData = { id: store.getStringAdminId(), password: '1234567', newPassword: 'lld5594' }
          try {
            await test.verifyPassword(verifyData)
            throw new Error('Expected a verifypassword error but nothing happenned')
          } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.status).toBe(403)
            expect(error.message).toBe('No se puede cambiar el password a un usuario Root')
          }
      })
  })
  describe('protectProtocol method', () => {
    it('should ignore restricted fields when updating a Root user', async() => { 
      const updateData = {email:'perico@hotmail.com', password: '1234567', nickname:'userperico', enabled:false }
      const response = await test.update(store.getStringAdminId(), updateData)
      expect(response.message).toBe('Usuario actualizado. Advertencia: Un usuario Root no puede cambiar: email, password, enabled')
      expect(response.results).toEqual({
        id: expect.any(String),
        email: 'user3@email.com', //No deberia cambiar
        nickname: 'userperico', //parametro actualizado
        typeId: 'dni',
        numberId: '12345678',
        role: 'Root',
        username: 'Three',
        picture: 'https://picsum.photos/200?random=3',
        enabled: true, //No deberia cambiar
        cars: []
      })
    })
    it('should throw an error when trying to delete a Root user', async() => {
      try {
        await test.delete(store.getStringAdminId())
        throw new Error('Expected a delete error but nothing happenedd')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.status).toBe(403)
        expect(error.message).toBe('No se puede eliminar un usuario Root')
      }
    })
  })
  describe('update method', () => {
    it('should update a non-root user normally', async() => {
      const updateData = {email:'perico@hotmail.com', password: '1234567', nickname:'userperico', enabled:false }
      const response = await test.update(store.getStringId(), updateData)
      expect(response.message).toBe('Usuario actualizado exitosamente')
      expect(response.results).toEqual({
        id: expect.any(String),
        email: 'perico@hotmail.com', //parametro actualizado (no permitido en Root)
        nickname: 'userperico', //parametro actualizado
        typeId: 'dni',
        numberId: '12345678',
        role: 'Usuario',
        username: 'One',
        picture: 'https://picsum.photos/200?random=1',
        enabled: false, //parametro actualizado (no permitido en Root)
        cars: []
      })
    })
  })
  describe('delete method', () => {
    it('should delete a non-root user normally', async() => {
        const response = await test.delete(store.getStringId())
        expect(response).toEqual({message: "User deleted successfully", results: ""})  
    })
  })
})
