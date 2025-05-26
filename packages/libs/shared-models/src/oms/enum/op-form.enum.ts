
// export class OpFormEnum {
//     PF='PF'; // panel form
//     GF='GF'; // garment form
//     SGF='SGF'; // semi gmt form
//     PACKF='PACKF'; // gmt in its packed form inside a sachet or something
// }

export enum OpFormEnum {
    PF='PANEL_FORM',// panel form
    GF='GARMENT_FORM', // garment form
    SGF='SEMI_GARMENT_FORM', // semi gmt form
    PACKF='PACKF', // gmt in its packed form inside a sachet or something   
}

export const  OpFormEnumDisplayValues ={
    PF:'Panel Form',// panel form
    GF:'Garment Form', // garment form
    SGF:'Semi Garment Form', // semi gmt form
    PACKF:'Pack Form', // gmt in its packed form inside a sachet or something   
}