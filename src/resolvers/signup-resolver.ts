import { SignUpModel } from "../dtos/models/signup-model";
import { SignUpInput } from "../dtos/inputs/signup-input";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { prismaClient } from "../database/prismaClient"
import { GraphQLError } from "graphql";
@Resolver()
export class SignUpResolver{
    @Query(() => String)

    @Mutation(() => SignUpModel)
    async signUp(@Arg('data') data: SignUpInput, @Ctx() context: any): Promise<SignUpModel>{

        const {
            email,
            password,
            firstName,
            lastName,
            documentNumber,
            phoneNumber,
            isNewsLetter
        } = data

        const emailLowerCase:string = email.toLocaleLowerCase();
        const firstNameCapitalize:string = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLocaleLowerCase();
        const lastNameCapitalize:string = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLocaleLowerCase();
        const companyIdUUID: String = context["company-id"];

        const findUser = await prismaClient.account_user.findUnique({
            where: {
                username: emailLowerCase as string
            }
        })

        const company = await prismaClient.account_company.findUnique({
            where: {
                code: companyIdUUID.toString()
            }
        })

        if(findUser) throw new GraphQLError("User already exists");

        const dataModel: SignUpModel = {
            email: emailLowerCase,
            userName: emailLowerCase,
            firstName: firstNameCapitalize,
            lastName: lastNameCapitalize,
            documentNumber: documentNumber ?? "",
            phoneNumber: phoneNumber ?? "",
            companyId: company.id,
            isActive: true,
            isConfirmed: false,
            isNewsLetter: isNewsLetter ?? false,
            isDeleted: false,
            isSuperUser: false,
            isStaff: false
        }

        await prismaClient.account_user.create({
            data: {
                username: dataModel.userName as string,
                email:  dataModel.email as string,
                password: password as string,
                first_name: dataModel.firstName as string,
                last_name:  dataModel.lastName as string,
                document_number: dataModel.documentNumber as string,
                company_id: dataModel.companyId as number,
                phone_number: dataModel.phoneNumber as string,
                is_active: dataModel.isActive as boolean,
                is_confirmed:  dataModel.isConfirmed as boolean,
                is_newsletter:  dataModel.isNewsLetter as boolean,
                is_deleted:  dataModel.isDeleted as boolean,
                is_superuser: dataModel.isSuperUser as boolean,
                is_staff: false
            }
        })
    
        return dataModel
    }
}