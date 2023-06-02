import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SignUpModel{
    @Field()
    email: String;

    @Field()
    firstName: String;

    @Field()
    lastName: String;

    @Field()
    documentNumber: String;

    @Field()
    phoneNumber: String;

    @Field()
    isNewsLetter: Boolean;
}