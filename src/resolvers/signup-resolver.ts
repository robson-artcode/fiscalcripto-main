import { SignUpModel } from "../dtos/models/signup-model";
import { SignUpInput } from "../dtos/inputs/signup-input";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class SignUpResolver{
    @Query(() => String)

    @Mutation(() => SignUpModel)
    async signUp(@Arg('data') data: SignUpInput){
        const signUp = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            documentNumber: "",
            phoneNumber: "",
            isNewsLetter: false
        }
        return signUp
    }
}