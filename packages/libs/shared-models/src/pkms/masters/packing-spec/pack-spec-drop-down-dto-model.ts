import React from "react";

export class PackSpecDropDownDtoModel {
    id: number;
    code: string;
    desc: string;
    constructor(
        id: number,
        code: string,
        desc: string
    ) {
        this.id = id
        this.code = code
        this.desc = desc
    }
}
