import { SignUpModel } from "../dtos/models/signup-model";
import { SignUpInput } from "../dtos/inputs/signup-input";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { prismaClient } from "../database/prismaClient"
import { GraphQLError } from "graphql";
@Resolver()
export class SignUpResolver{
    @Query(() => String)

    @Mutation(() => SignUpModel)
    async signUp(@Arg('data') data: SignUpInput){

        const {
            email,
            password,
            firstName,
            lastName,
            documentNumber,
            phoneNumber,
            isNewsLetter
        } = data

        const findUser = await prismaClient.account_user.findUnique({
            where: {
                username: email as string
            }
        })

        if(findUser) throw new GraphQLError("User already exists");

        await prismaClient.account_user.create({
            data: {
                username: email as string,
                password: password as string,
                first_name: firstName as string,
                last_name: lastName as string,
                email: email as string,
                document_number: documentNumber as string ?? "",
                phone_number: phoneNumber as string ?? "",
                is_active: true,
                is_confirmed: false,
                is_newsletter: isNewsLetter as boolean ?? false,
                is_deleted: false
            }
        })
    
        return data
    }
}