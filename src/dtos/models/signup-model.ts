import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SignUpModel{
    @Field()
    email: String;

    @Field()
    userName: String;

    @Field()
    firstName: String;

    @Field()
    lastName: String;

    @Field()
    documentNumber: String;

    @Field()
    phoneNumber: String;

    @Field()
    companyId: Number;

    @Field()
    isActive: Boolean;

    @Field()
    isConfirmed: Boolean;

    @Field()
    isNewsLetter: Boolean;

    @Field()
    isDeleted: Boolean;

    @Field()
    isSuperUser: Boolean;

    @Field()
    isStaff: Boolean;
}