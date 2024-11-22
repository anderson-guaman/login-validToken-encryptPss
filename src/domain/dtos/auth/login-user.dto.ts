import { regularExps } from "../../../config";




export class LoginUserDto {

    private constructor(
        public email: string,
        public password: string,
        
    ) { };

    static login(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = object;

        // validations

        if (!email) return ['Missing email', undefined];

        if (!regularExps.email.test(email)) return ['Email is not valid'];

        if (!password ) return ['Missing password', undefined];

        if ( password.length < 6 ) return ['Password too short']

        return [undefined, new LoginUserDto( email, password)]
    }
}