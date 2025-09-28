import {User} from '../../Configs/seqDb.js'
export interface IUserTestSeq {
    id: string
    email: string
    password: string
    nickname?: string | null
    username: string
    typeId: string 
    numberId: string 
    picture?: string | null
    role: string |number
    enabled: boolean
}
export interface CreateUserInput {
    email: string
    password: string
    nickname?: string | null
    username: string
    typeId: string
    numberId: string
    picture?: string | null
    role: string |number
    enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const parser = (u: InstanceType<typeof User>): IUserTestSeq => {
  const raw = u.get() // u.get() da un objeto plano con todos los atributos
  return {
    id: raw.id,
    email: raw.email,
    password: raw.password,
    nickname: raw.nickname,
    username: raw.username,
    typeId: raw.typeId,
    numberId: raw.numberId,
    picture: raw.picture,
    role: roleConverter(raw.role),
    enabled: raw.enabled
  }
}
export interface IUserWithCarTestSeq extends IUserTestSeq {
  cars?: Array<{
    id: string
    patent: string
  }>
}
export const relatedParser = (
  u: InstanceType<typeof User>
): IUserWithCarTestSeq => {
  const raw = u.get({ plain: true }) as any
  return {
    id: raw.id,
    email: raw.email,
    password: raw.password,
    nickname: raw.nickname,
    username: raw.username,
    typeId: raw.typeId,
    numberId: raw.numberId,
    picture: raw.picture,
    role: roleConverter(raw.role),
    enabled: raw.enabled,
    cars: raw.Cars
      ? raw.Cars.map((c: any) => ({
          id: c.id,
          patent: c.licensePlate
        }))
      : []
  }
}
function roleConverter(role:number):string{
  switch(Number(role)){
    case 2:
      return 'Mecanico'
    case 3:
      return 'Admin'
    case 9:
      return 'Root'
    default:
      case 1:
      return 'Usuario'
  }
}
export const dataCreate = {
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  username: 'user',
  typeId: 'dni',
  numberId:'12345678',
  picture: 'https://picsum.photos/200?random=16',
}
export const dataUpdate: UpdateUserInput = {
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  username: 'user',
  typeId: 'dni',
  numberId:'12345678',
  picture: 'https://picsum.photos/200?random=16',
  role: 'Usuario',
  enabled: true
}


//*--------------------------------------------------
//?          UserSeed
//*------------------------------------------------
export const createSeedRandomElements = async(model: any, seed:unknown[]) =>{
  try {
    if(!seed || seed.length===0)throw new Error('No data')
      await model.bulkCreate(seed)
  } catch (error) {
    console.error('Error createSeedRandomElements: ', error)
  }
}
export type Seed = Record<any, any>
export const createSeedRelatedElements = async(model: any,seed:Seed[],  secondModel:any, secondSeed:Seed[], foreignKey: string) =>{
  try {
    if (!seed || seed.length === 0) throw new Error("No data");

    // 1. Insertamos los seeds principales
    const created = await model.bulkCreate(seed, { returning: true });

    // 2. Creamos los relacionados
    const related = created.map((item, index) => ({
      ...secondSeed[index],
      [foreignKey]: item.id, // 👈 agregamos la relación
    }));

    // 3. Insertamos en el modelo secundario
    await secondModel.bulkCreate(related);

    console.log("Seeds creados con relaciones OK ✅");
  } catch (error) {
    console.error("Error createSeedRelatedElements: ", error);
  }
}
export const usersSeed = [
  {
    email: "user1@email.com",
    password: "123456",
    nickname: "userTest1",
    typeId: 'dni',
    numberId:'12345678',
    username: "One",
    picture: "https://picsum.photos/200?random=1",
    enabled: true
  },
  {
    email: "user2@email.com",
    password: "123456",
    nickname: "userTest2",
    typeId: 'dni',
    numberId:'12345678',
    username: "Two",
    picture: "https://picsum.photos/200?random=2",
    enabled: true
  },
  {
    email: "user3@email.com",
    password: "123456",
    nickname: "userTest3",
    typeId: 'dni',
    numberId:'12345678',
    username: "Three",
    picture: "https://picsum.photos/200?random=3",
    enabled: true
  },
  {
    email: "user4@email.com",
    password: "123456",
    nickname: "userTest4",
    typeId: 'dni',
    numberId:'12345678',
    username: "Four",
    picture: "https://picsum.photos/200?random=4",
    enabled: true
  },
  {
    email: "user5@email.com",
    password: "123456",
    nickname: "userTest5",
    typeId: 'dni',
    numberId:'12345678',
    username: "Five",
    picture: "https://picsum.photos/200?random=5",
    enabled: true
  },
  {
    email: "user6@email.com",
    password: "123456",
    nickname: "userTest6",
    typeId: 'dni',
    numberId:'12345678',
    username: "Six",
    picture: "https://picsum.photos/200?random=6",
    enabled: false
  },
  {
    email: "user7@email.com",
    password: "123456",
    nickname: "userTest7",
    typeId: 'dni',
    numberId:'12345678',
    username: "Seven",
    picture: "https://picsum.photos/200?random=7",
    enabled: false
  },
  {
    email: "user8@email.com",
    password: "123456",
    nickname: "userTest8",
    typeId: 'dni',
    numberId:'12345678',
    username: "Eight",
    picture: "https://picsum.photos/200?random=8",
    enabled: true
  },
  {
    email: "user9@email.com",
    password: "123456",
    nickname: "userTest9",
    typeId: 'dni',
    numberId:'12345678',
    username: "Nine",
    picture: "https://picsum.photos/200?random=9",
    enabled: true
  },
  {
    email: "user10@email.com",
    password: "123456",
    nickname: "userTest10",
    typeId: 'dni',
    numberId:'12345678',
    username: "Ten",
    picture: "https://picsum.photos/200?random=10",
    enabled: true
  },
  {
    email: "user11@email.com",
    password: "123456",
    nickname: "userTest11",
    typeId: 'dni',
    numberId:'12345678',
    username: "Eleven",
    picture: "https://picsum.photos/200?random=11",
    enabled: true
  },
  {
    email: "user12@email.com",
    password: "123456",
    nickname: "userTest12",
    typeId: 'dni',
    numberId:'12345678',
    username: "Twelve",
    picture: "https://picsum.photos/200?random=12",
    enabled: true
  },
  {
    email: "user13@email.com",
    password: "123456",
    nickname: "userTest13",
    typeId: 'dni',
    numberId:'12345678',
    username: "Thirteen",
    picture: "https://picsum.photos/200?random=13",
    enabled: true
  },
  {
    email: "user14@email.com",
    password: "123456",
    nickname: "userTest14",
    typeId: 'dni',
    numberId:'12345678',
    username: "Fourteen",
    picture: "https://picsum.photos/200?random=14",
    enabled: true
  },
  {
    email: "user15@email.com",
    password: "123456",
    nickname: "userTest15",
    typeId: 'dni',
    numberId:'12345678',
    username: "Fifteen",
    picture: "https://picsum.photos/200?random=15",
    enabled: false
  }
];

export const cars = [
  {
   
    licensePlate: "AB123CD",
    brand: "Toyota",
    model: "Corolla",
    year: 2018,
    motorNum: "MTR001",
    chassisNum: "CHS001",
    observations: "Revisión técnica al día",
    picture: null,
    enabled: true,
  },
  {
   
    licensePlate: "CD456EF",
    brand: "Ford",
    model: "Fiesta",
    year: 2016,
    motorNum: "MTR002",
    chassisNum: "CHS002",
    observations: null,
    picture: null,
    enabled: true,
  },
  {
   
    licensePlate: "EF789GH",
    brand: "Chevrolet",
    model: "Onix",
    year: 2019,
    motorNum: "MTR003",
    chassisNum: "CHS003",
    observations: "Único dueño",
    picture: null,
    enabled: true,
  },
  {
   
    licensePlate: "GH012IJ",
    brand: "Volkswagen",
    model: "Golf",
    year: 2017,
    motorNum: "MTR004",
    chassisNum: "CHS004",
    observations: null,
    picture: null,
    enabled: true,
  },
  {
 
    licensePlate: "IJ345KL",
    brand: "Honda",
    model: "Civic",
    year: 2020,
    motorNum: "MTR005",
    chassisNum: "CHS005",
    observations: "Cambio de aceite reciente",
    picture: null,
    enabled: true,
  },
  {
   
    licensePlate: "KL678MN",
    brand: "Nissan",
    model: "Sentra",
    year: 2015,
    motorNum: "MTR006",
    chassisNum: "CHS006",
    observations: null,
    picture: null,
    enabled: true,
  },
  {
    licensePlate: "MN901OP",
    brand: "Peugeot",
    model: "208",
    year: 2019,
    motorNum: "MTR007",
    chassisNum: "CHS007",
    observations: "Neumáticos nuevos",
    picture: null,
    enabled: true,
  },
  {
    licensePlate: "OP234QR",
    brand: "Renault",
    model: "Clio",
    year: 2014,
    motorNum: "MTR008",
    chassisNum: "CHS008",
    observations: null,
    picture: null,
    enabled: true,
  },
  {
 
    licensePlate: "QR567ST",
    brand: "Fiat",
    model: "Cronos",
    year: 2021,
    motorNum: "MTR009",
    chassisNum: "CHS009",
    observations: null,
    picture: null,
    enabled: true,
  },
  {

    licensePlate: "ST890UV",
    brand: "Hyundai",
    model: "Elantra",
    year: 2018,
    motorNum: "MTR010",
    chassisNum: "CHS010",
    observations: "Servicios oficiales",
    picture: null,
    enabled: true,
  },
  {

    licensePlate: "UV123WX",
    brand: "Kia",
    model: "Rio",
    year: 2017,
    motorNum: "MTR011",
    chassisNum: "CHS011",
    observations: null,
    picture: null,
    enabled: true,
  },
  {
    licensePlate: "WX456YZ",
    brand: "BMW",
    model: "320i",
    year: 2020,
    motorNum: "MTR012",
    chassisNum: "CHS012",
    observations: "Mantenimiento premium",
    picture: null,
    enabled: true,
  },
  {
    licensePlate: "YZ789AB",
    brand: "Mercedes-Benz",
    model: "C200",
    year: 2021,
    motorNum: "MTR013",
    chassisNum: "CHS013",
    observations: null,
    picture: null,
    enabled: true,
  },
  {

    licensePlate: "AB012CD",
    brand: "Audi",
    model: "A3",
    year: 2019,
    motorNum: "MTR014",
    chassisNum: "CHS014",
    observations: "Última revisión en concesionario",
    picture: null,
    enabled: true,
  },
  {
    licensePlate: "CD345EF",
    brand: "Jeep",
    model: "Renegade",
    year: 2018,
    motorNum: "MTR015",
    chassisNum: "CHS015",
    observations: null,
    picture: null,
    enabled: true,
  },
];

