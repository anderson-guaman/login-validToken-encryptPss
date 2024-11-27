import { Request, Response } from "express";
import { CustomError,LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";



export class AuthController {


    constructor(
        public autService:AuthService,
    ) { };

    private handleError = ( error:unknown, res:Response) => {
        if( error instanceof CustomError ){  //si la instancia del error es de tipo cutomError
            return res.status(error.statusCode).json({error:error.message})
        } 

        console.log(`${error}`);
        return res.status(500).json({error})
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error })
        
        this.autService.registerUser(registerUserDto!)
        .then((user) => res.json(user)) // then means luego, se ejecuta si no hay errores de por medio 
        .catch( error => this.handleError(error, res)); // catch captura o maneja el error si algo sale mal 

    }


    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.login(req.body);
        if(error) return res.status(400).json({error})

        this.autService.loginUser(loginUserDto!)
        .then((user) => res.json(user))
        .catch( error => this.handleError(error,res))

    }

    validateEmail = (req: Request, res: Response) => {

        const { token } = req.params;
        this.autService.validateEmail( token )
        .then( () => res.json('Email validated'))
        .catch( error => this.handleError(error,res) )
        // res.json(token);
    }

    
}