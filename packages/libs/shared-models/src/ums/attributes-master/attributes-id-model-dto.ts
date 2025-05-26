import { CommonRequestAttrs, InputTypesEnum } from "../../common";


export class AttributesIdModelDto extends CommonRequestAttrs {
    id: number
    name: string;
    labelName: string;
    inputType: InputTypesEnum;
    requiredField: boolean;
    placeHolder: string;
    validationMessage: string;
    maxLength: number;
    minLength: number;
    title: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        id: number,
        name: string,
        labelName: string,
        inputType: InputTypesEnum,
        requiredField: boolean,
        placeHolder: string,
        validationMessage: string,
        maxLength: number,
        minLength: number,
        title: string,
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.name = name;
        this.labelName = labelName;
        this.inputType = inputType;
        this.requiredField = requiredField;
        this.placeHolder = placeHolder;
        this.validationMessage = validationMessage;
        this.maxLength = maxLength;
        this.minLength = minLength;
        this.title = title;

    }
}    