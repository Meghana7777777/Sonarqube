import { CommonRequestAttrs, GenericOptionsTypeEnum, InputTypesEnum } from "../../common";


export class AttributesMasterModelDto {
    id: number
    name: string;
    labelName: string;
    inputType: InputTypesEnum;
    requiredField: boolean;
    placeHolder: string;
    validationMessage: string;
    maxLength: number;
    minLength: number;
    isActive: boolean;
    options?: {
        value: string;
        label: string;
    }[];
    hidden?: boolean;
    disabled?: boolean;
    optionsType?: GenericOptionsTypeEnum;
    optionsSource?: string[];
    constructor(
        id: number,
        name: string,
        labelName: string,
        inputType: InputTypesEnum,
        requiredField: boolean,
        placeHolder: string,
        validationMessage: string,
        maxLength: number,
        minLength: number,
        isActive: boolean,
        options?: {
            value: string;
            label: string;
        }[],
        hidden?: boolean,
        disabled?: boolean,
        optionsType?: GenericOptionsTypeEnum,
        optionsSource?: string[],
    
    ) {
        this.id = id;
        this.name = name;
        this.labelName = labelName;
        this.inputType = inputType;
        this.requiredField = requiredField;
        this.placeHolder = placeHolder;
        this.validationMessage = validationMessage;
        this.maxLength = maxLength;
        this.minLength = minLength;
        this.isActive = isActive;
        this.options = options;
        this.hidden = hidden;
        this.disabled = disabled;
        this.optionsType = optionsType;
        this.optionsSource = optionsSource;

    }
}



