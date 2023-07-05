import { SignUpModel } from "../dtos/models/signup-model";
import { SignUpInput } from "../dtos/inputs/signup-input";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { prismaClient } from "../database/prismaClient"
import { GraphQLError } from "graphql";
import { UUID } from "crypto";

@Resolver()
export class SignUpResolver{
    @Query(() => String)

    @Mutation(() => SignUpModel)
    async signUp(@Arg('data') data: SignUpInput, @Ctx() context: any): Promise<SignUpModel>{

        const {
            email,
            password,
            confirmPassword,
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
      
        if(!companyIdUUID) throw new GraphQLError("Company-Id does not exist in header");
        const company = await prismaClient.account_company.findUnique({
            where: {
                code: companyIdUUID.toString()
            }
        })
  
        if(!company) throw new GraphQLError("Company-Id does not exists in database");
        if(password !== confirmPassword) throw new GraphQLError("Password and confirmation do not match");
        
        const type = await prismaClient.account_type.findUnique({
            where: {
                type: "USER_FINAL"
            }
        })

        var findUser = await prismaClient.account_user.findUnique({
            where: {
                username: emailLowerCase as string
            }
        })

        const dataModel: SignUpModel = {
            email: emailLowerCase,
            userName: emailLowerCase,
            firstName: firstNameCapitalize,
            lastName: lastNameCapitalize,
            documentNumber: documentNumber ?? "",
            phoneNumber: phoneNumber ?? "",
            companyId: company.id,
            typeId: type.id,
            hasCompletedOnboard: false,
            isActive: true,
            isConfirmed: false,
            isNewsLetter: isNewsLetter ?? false,
            isDeleted: false,
            isSuperUser: false,
            isStaff: false
        }

        if(findUser) {
            if(!findUser.is_deleted){
                throw new GraphQLError("User already exists");
            } else {
                await prismaClient.account_user.update({
                    data: {
                        username: dataModel.userName as string,
                        email:  dataModel.email as string,
                        password: password as string,
                        first_name: dataModel.firstName as string,
                        last_name:  dataModel.lastName as string,
                        document_number: dataModel.documentNumber as string,
                        phone_number: dataModel.phoneNumber as string,
                        is_active: dataModel.isActive as boolean,
                        is_confirmed:  dataModel.isConfirmed as boolean,
                        is_newsletter:  dataModel.isNewsLetter as boolean,
                        is_deleted:  dataModel.isDeleted as boolean
                    },
                    where: {
                        id: findUser.id
                    }
                })

            }
        } else {
            findUser = await prismaClient.account_user.create({
                data: {
                    username: dataModel.userName as string,
                    email:  dataModel.email as string,
                    password: password as string,
                    first_name: dataModel.firstName as string,
                    last_name:  dataModel.lastName as string,
                    document_number: dataModel.documentNumber as string,
                    company_id: dataModel.companyId as number,
                    type_id: dataModel.typeId as number,
                    has_completed_onboard: dataModel.hasCompletedOnboard as boolean,
                    phone_number: dataModel.phoneNumber as string,
                    is_active: dataModel.isActive as boolean,
                    is_confirmed:  dataModel.isConfirmed as boolean,
                    is_newsletter:  dataModel.isNewsLetter as boolean,
                    is_deleted:  dataModel.isDeleted as boolean,
                    is_superuser: dataModel.isSuperUser as boolean,
                    is_staff: dataModel.isStaff as boolean
                }
            })
        }

        const crypto = require('crypto');
        const code = crypto.randomUUID();

        await prismaClient.account_userconfirm.create({
            data: {
                code: code as UUID,
                user_id: findUser.id as number
            }
        })

        const userWizardConfig = await prismaClient.account_userwizardconfig.findUnique({
            where: {
                company_id: company.id
            }
        })

        await prismaClient.account_userwizard.create({
            data: {
                cost_calculation: userWizardConfig.cost_calculation as number,
                pnl_in_crypto_trades: userWizardConfig.pnl_in_crypto_trades as boolean,
                pnl_consolidation: userWizardConfig.pnl_consolidation as boolean,
                one_time_in1888_delay_fee: userWizardConfig.one_time_in1888_delay_fee as boolean,
                user_id: findUser.id as number,
                company_id: company.id as number,
            }
        })

        // {{ SENDMAIL_EVENT }}
    
        return dataModel
    }
}