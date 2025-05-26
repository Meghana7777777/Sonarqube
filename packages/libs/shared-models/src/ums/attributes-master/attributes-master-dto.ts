import { CommonRequestAttrs, GenericOptionsTypeEnum, InputTypesEnum } from "../../common";

export class AttributesMasterCreateReq extends CommonRequestAttrs {
    id: number
    name: string;
    labelName: string;
    inputType: InputTypesEnum;
    requiredField: boolean;
    placeHolder: string;
    validationMessage: string;
    maxLength: number;
    minLength: number;
    hidden: boolean;
    disabled: boolean;
    optionsType?: GenericOptionsTypeEnum;
    optionsSource?: string[];
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
        hidden: boolean,
        disabled: boolean,
        optionsType?: GenericOptionsTypeEnum,
        optionsSource?: string[],
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
        this.disabled = disabled;
        this.hidden = hidden;
        this.optionsType = optionsType;
        this.optionsSource = optionsSource;
    }
}