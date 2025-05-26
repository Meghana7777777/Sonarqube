import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { GenericOptionsTypeEnum, InputTypesEnum } from "@xpparel/shared-models";
@Entity('attributes_master')
export class AttributesMasterEntity extends AbstractEntity {

    @Column('varchar', {
        name: 'name',
        nullable: false
    })
    name: string;

    @Column('varchar', {
        name: 'label_name',
        nullable: false
    })
    labelName: string;

    @Column('varchar', {
        name: 'input_type',
        nullable: false
    })
    inputType: InputTypesEnum;

    @Column('boolean', {
        name: 'required_field',
        nullable: false
    })
    requiredField: boolean;

    @Column('varchar', {
        name: 'place_holder',
        nullable: true
    })
    placeHolder: string;

    @Column('varchar', {
        name: 'validation_message',
        nullable: true
    })
    validationMessage: string;

    @Column('int', {
        name: 'max_length',
        nullable: true
    })
    maxLength: number;

    @Column('int', {
        name: 'min_length',
        nullable: true
    })
    minLength: number;

    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'disabled',
    })
    disabled: boolean;


    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'hidden',
    })
    hidden: boolean;

    @Column('enum', { name: 'options_type', nullable: true, enum: GenericOptionsTypeEnum })
    optionsType: GenericOptionsTypeEnum;

    @Column('text', { name: 'options_source', nullable: true })
    optionsSource: string;
}