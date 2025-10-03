import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { throwError } from '../../Configs/errorHandlers.js'

export class UserMiddlewares {
  static createUserPrepare = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, typeId, numberId, country, picture } = req.body
    const assambledPass = passwordFormatter(typeId, numberId)
    req.body = {
      email,
      password: await bcrypt.hash(assambledPass, 12),
      nickname: email.split('@')[0],
      username,
      typeId: typeId.toUpperCase(),
      numberId,
      country: capitalizeFirstLetter(country),
      picture,
      clientPassword: assambledPass
    }
    next()
  }
}

export interface resetPass {
  hashedPassword: string
  recoveredPass: string
}
export async function resetedPass (typeDoc: string, doc: string): Promise<resetPass> {
  const pass = passwordFormatter(typeDoc, doc)
  return {
    hashedPassword: await bcrypt.hash(pass, 12),
    recoveredPass: pass
  }
}

function passwordFormatter (typeDoc: string, doc: string): string {
  const prefix = 'BHT'
  let acc
  if (typeDoc === 'CUIT' || typeDoc === 'CUIL') {
    acc = doc.slice(-7, -1)
  } else {
    acc = doc.slice(-6)
  }
  return `${prefix}${acc}`
}
function capitalizeFirstLetter (word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
