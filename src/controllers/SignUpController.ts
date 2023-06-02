import { Request, Response } from 'express'
import { prismaClient } from 'src/database/prismaClient';

export class SignUpController{
    async handle(request: Request, response: Response) {

        const { 
            email,
            password,
            firstName,
            lastName,
            documentNumber,
            phoneNumber,
            isNewsLetter
        } = request.body;

        const newUser = await prismaClient.account_user.create({
            data: {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                document_number: documentNumber,
                phone_number: phoneNumber,
                username: email,
                is_active: true,
                is_confirmed: false,
                is_newsletter: isNewsLetter,
                created_at: new Date(),
                updated_at: new Date()
            }
        })


       return response.json();
    }
}