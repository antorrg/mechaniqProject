import {Request, Response, NextFunction} from 'express'

export class UserMiddlewares {
    static createUserPrepare = async(req: Request, res: Response, next: NextFunction)=>{
    }
}

 function passwordFormatter(typeDoc:string, doc:string): string{
   const prefix = 'BHT'
   let acc 
   if(typeDoc === 'cuit' || typeDoc === 'cuil'){
     acc = doc.slice(-7, -1)
   }else{
     acc = doc.slice(-6)
   }
   return `${prefix}${acc}`
 }