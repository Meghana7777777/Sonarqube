export class MessageParameters{
    recepient : string;
    template : string;
    parameters : any
    languageCode ? : string
    constructor (recepient:string,template:string, parameters :any,languageCode?:string) {
        this.recepient = recepient;
        this.template = template;
        this.parameters = parameters;
        this.languageCode = languageCode
    }
}