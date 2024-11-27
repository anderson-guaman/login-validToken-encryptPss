import nodemailer, { Transporter } from 'nodemailer';


interface SendMailOptions{
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment{
    filename: string;
    path:string;
}

export class EmailService{

    private transporter: Transporter;

    

    constructor(
        MAILER_SERVICE:string,
        MAILER_EMAIL:string,
        MAILER_SECRET_KEY:string,

    ){

        this.transporter = nodemailer.createTransport({
            service: MAILER_SERVICE,
            auth:{
                user: MAILER_EMAIL,
                pass: MAILER_SECRET_KEY,
            }
        });
    }

    async sendEmail(options:SendMailOptions):Promise<boolean>{

        const{to,subject,htmlBody,attachments = []}=options;

        try {

            const sendInformation = await this.transporter.sendMail({
                to:to,
                subject:subject,
                html:htmlBody,
                attachments:attachments,
            })

            // console.log(sendInformation)
            return true;

        } catch (error) {
            console.log(error)
            return false;
        }
    }

}