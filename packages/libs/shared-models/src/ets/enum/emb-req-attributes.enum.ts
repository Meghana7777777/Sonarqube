
export enum EmbReqAttibutesEnum {
    COMPONENTS = 'COMP', // csv // header props
    MONO = 'MO', //csv // header props
    MOLINES = 'MOL', //csv // header props
    PROD_NAME = 'P_N', // header props
    PROD_TYPE = 'P_T', // header props
    JOB_QTY = 'J_Q', // header props
    STYLE = 'STY', // header props

    ITEM_CODE = 'IT_C', // Line props
    ITEM_DESC = 'IT_D',// Line props
    AD_PLIES = 'AD_P',// Line props
    PD_PLIES = 'PD_P',// Line props
    AD_NUMBER = 'AD_N',// Line props
    // CUT_NUMBER = 'C_N'// Line props - This is not possible here because cut generaiton is a user choice
}