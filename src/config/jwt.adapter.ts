
import jwt from 'jsonwebtoken'
import { envs } from './envs';


export  class JwtAdapter {
    
    static JWT_SEED = envs.JWT_SEED;
    // DI?
    constructor( ) {
        
    };


    static generateToken( payload: any, duration: string = '2h'){

        return new Promise((resolve)=>{
            jwt.sign(payload, this.JWT_SEED , {expiresIn: duration}, (error, token)=>{

                if( error) return resolve(null) // o simplemente return null
                return resolve(token) // o simplemente return token 
            })
        });
    };


    static validateToken( token: string){

        throw new Error('Not implement')
        return;
    }

}