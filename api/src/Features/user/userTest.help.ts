import bcrypt from 'bcrypt'
import { parsedRole } from './userMappers'

export async function getUserSeeds () {
  return [{
    email: 'user1@email.com',
    password: await bcrypt.hash('1234567', 12),
    nickname: 'userTest1',
    typeId: 'dni',
    numberId: '12345678',
    role: parsedRole('Usuario'),
    username: 'One',
    picture: 'https://picsum.photos/200?random=1',
    enabled: true
  }, {
    email: 'user2@email.com',
    password: await bcrypt.hash('1234567', 12),
    nickname: 'userTest2',
    typeId: 'dni',
    numberId: '12345678',
    role: parsedRole('Usuario'),
    username: 'Two',
    picture: 'https://picsum.photos/200?random=2',
    enabled: false
  }, {
    email: 'user3@email.com',
    password: await bcrypt.hash('1234567', 12),
    nickname: 'userTest3',
    typeId: 'dni',
    numberId: '12345678',
    role: 9,
    username: 'Three',
    picture: 'https://picsum.photos/200?random=3',
    enabled: true
  }]
}
