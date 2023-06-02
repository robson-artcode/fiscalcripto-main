import { Field, InputType } from "type-graphql";

@InputType()
export class SignUpInput {
    @Field()
    email: String;

    @Field()
    password: String;

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