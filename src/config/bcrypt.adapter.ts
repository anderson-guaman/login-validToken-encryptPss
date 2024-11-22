import { compare, compareSync, genSalt, genSaltSync, hash, hashSync } from 'bcryptjs'

export const bcrypAdapter = {

    // metodo que regresa la contraseña encriptada
    hash : (password: string) =>{
        const salt = genSaltSync(); // 10 vultas default value
        return hashSync(password,salt); 
    },

    // metodo para validar contraseña encriptada
    compare:(password: string, hashed: string) => {
        return compareSync(password,hashed); // return true or false
    }
}