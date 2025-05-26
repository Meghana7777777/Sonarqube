import { InsUomEnum } from "@xpparel/shared-models";
import moment from "moment";

export function getProperDateWithTime(date: Date | string, secs?: boolean) {
    if(!date) {
        return null;
    }
    // 24 hours format of the local systen where the app is running
    if(secs) {
        return moment(date).local().format('YYYY-MM-DD HH:mm:ss');
    } else {
        return moment(date).local().format('YYYY-MM-DD HH:mm');
    }
}

export function getCurrentDateTime(secs?: boolean) {
    if(secs) {
        return moment().local().format('YYYY-MM-DD HH:mm:ss');
    } else {
        return moment().local().format('YYYY-MM-DD HH:mm');
    }
}

export function  getProperDate(date: Date | string) {
    if(!date) {
        return null;
    }
    return moment(date).local().format('YYYY-MM-DD');
}

export function getCurrentDate(secs?: boolean) {
    return moment().local().format('YYYY-MM-DD');
}

// this formula is used to calculate the material requirement in actual marker material allocation
export function calculateMaterialRequirement(plies: number,cutWastage: number,aMarkerLength: number,bindReqWithOutWastage: number): number {
    if(cutWastage) {
        const result = Number( Number(((Number(aMarkerLength) * Number(plies) * (1 + Number(cutWastage)/100)) + Number(bindReqWithOutWastage))).toFixed(2));
        return(result);
    } 
    const result =  Number(((Number(aMarkerLength) * Number(plies)) + Number(bindReqWithOutWastage)).toFixed(2));
    return(result);

}



export function convertValuesToASpecificUom(value: number, iUom: InsUomEnum, eUom: InsUomEnum) {
    const multiplier: number = uomConverterConfig[iUom][eUom];
    const convertedVal = Number((value * multiplier).toFixed(2));
    return convertedVal > 0 ? convertedVal : 0;
}

const uomConverterConfig = {
    [InsUomEnum.MTR] : {
        [InsUomEnum.CM] : 1000,
        [InsUomEnum.INCH] : 39.37,
        [InsUomEnum.YRD] : 1.0936,
    },
    [InsUomEnum.CM] : {
        [InsUomEnum.YRD] : 0.0109,
        [InsUomEnum.MTR] : 0.01,
        [InsUomEnum.INCH] : 0.3934,
    },
    [InsUomEnum.YRD] : {
        [InsUomEnum.CM] : 91.44,
        [InsUomEnum.INCH] : 36,
        [InsUomEnum.MTR] : 0.9144,
    },
    [InsUomEnum.INCH] : {
        [InsUomEnum.CM] : 1000,
        [InsUomEnum.YRD] : 1000,
        [InsUomEnum.MTR] : 1000,
    }
}

export const getLayoutSettings = (perRowCount: number = 3) => {
    if (perRowCount === 2) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11 },
                lg: { span: 11 },
                xl: { span: 11 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11, offset: 2 },
                lg: { span: 11, offset: 2 },
                xl: { span: 11, offset: 2 }
            }
        }
    } else if (perRowCount === 3) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 7 },
                lg: { span: 7 },
                xl: { span: 7 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 7, offset: 1 },
                lg: { span: 7, offset: 1 },
                xl: { span: 7, offset: 1 }
            }
        }
    } else if (perRowCount === 4) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 5 },
                lg: { span: 5 },
                xl: { span: 5 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 5, offset: 1 },
                lg: { span: 5, offset: 1 },
                xl: { span: 5, offset: 1 }
            }
        }
    } else {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11 },
                lg: { span: 11 },
                xl: { span: 11 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11, offset: 2 },
                lg: { span: 11, offset: 2 },
                xl: { span: 11, offset: 2 }
            }
        }
    }
}