import { bcrypAdapter, JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {

    //DI
    constructor() { };


    public async registerUser(registeUserDto: RegisterUserDto) {

        const existUser = await prisma.user.findFirst({
            where: { email: registeUserDto.email }
        })

        if (existUser) throw CustomError.badRequest('Email already exist');


        try {

            // encriptar password
            registeUserDto.password = bcrypAdapter.hash(registeUserDto.password)

            // saved user
            const user = await prisma.user.create({
                data: registeUserDto,
            });

            // JWT <---- para mantener la autentificacion del usuario

            // Email de confirmacion

            // return user without password using a UserEntity
            const { password, ...userEntity } = UserEntity.fromObject(user);


            return {
                user: userEntity,
                token: 'ABC',
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }



    public async loginUser(loginUserDto: LoginUserDto) {


        // findone para verificar si existe 
        const existUser = await prisma.user.findFirst({
            where: { email: loginUserDto.email }
        })

        if (!existUser) throw CustomError.badRequest('User or email not exist');

        // isMatch  .... bcryp...compare(123456, passwordEncription)

        const isValid = await bcrypAdapter.compare(loginUserDto.password, existUser.password)

        if (!isValid) throw CustomError.badRequest('Password invalid');

        const { password, ...restUser } = existUser;

        const token = await JwtAdapter.generateToken({ id: existUser.id , email:existUser.email});
        if (!token) throw CustomError.internalServer('Error while creating JWT')

        return {
            user: restUser,
            token: token
        }

    }
}