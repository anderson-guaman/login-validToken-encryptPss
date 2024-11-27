import { bcrypAdapter, envs, JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    //DI
    constructor(
        private readonly emailService: EmailService,
    ) { };


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
            await this.sendEmailValidationLink( user.email);

            // return user without password using a UserEntity
            const { password, ...userEntity } = UserEntity.fromObject(user);


            // generacion del token
            const token = await JwtAdapter.generateToken({ id: user.id , email:user.email});
            if (!token) throw CustomError.internalServer('Error while creating JWT')

            return {
                user: userEntity,
                token: token,
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


    private sendEmailValidationLink = async( email: string )=>{

        const token = await JwtAdapter.generateToken( {email} );
        if ( !token ) throw CustomError.internalServer( 'Error getting token' );

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email </p>
            <a href="${ link }"> Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if( !isSent ) throw CustomError.internalServer( 'Error sending email' );
        return true;
    }


    public validateEmail = async ( token: string) => {
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token')

        const {email} = payload as { email:string}
        if( !email ) throw CustomError.internalServer('Email not in token')

        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if( !user ) throw CustomError.internalServer('Email not exist');

        // user.emailValidated = true;
        // actualizo el estado de la validacion del email en la base de datos  true.
        await prisma.user.update({
            where: {email: email},
            data: { emailValidated : true}
        })
    }
}