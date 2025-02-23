import { Request } from 'express';
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role:string
      };
    }
  }
}
Request;

// declare module 'express' {
//   export interface Request {
//     user?: string
//   }
// }
