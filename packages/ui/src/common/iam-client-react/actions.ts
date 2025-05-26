import axios, { AxiosError } from "axios";
import { ActionTypes } from "./action-types";
import { IAMClientAuthActions } from "./reducers";
import { LoginUserDto, UserPermissionsDto } from "./user-models";

export const loginUser = async (dispatch: React.Dispatch<IAMClientAuthActions>, loginPayload: LoginUserDto) => {
    const { authServerUrl, username, password } = loginPayload
    //const service = new UsersService();
    const fileUploadPath = authServerUrl;


    try {
        dispatch({ type: ActionTypes.REQUEST_LOGIN });
        const response = await axios.post(`${authServerUrl}/authentications/login`, {
            username,
            password,
        });
        const res = response.data;
        if (res.status) {
            const aaa: any = res.data;
            localStorage.setItem('accessToken', aaa.accessToken);
            const menuData: UserPermissionsDto = aaa.accessMenuObj;
            const data = {
                loading: false,
                isAuthenticated: true,
                user: {
                    userId: menuData.userId,
                    userName: menuData.userName,
                    profilePicPath: aaa?.['filesData']?.[0]?.filePath?.slice(7) ? fileUploadPath + '/' + aaa?.['filesData']?.[0]?.filePath?.slice(7) : null,
                    roles: menuData.roleName ? menuData.roleName.join(',') : ``,
                    orgData: {
                        unitCode: menuData.unitCode,
                        companyCode: menuData.companyCode
                    }
                },
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: aaa.accessToken,
                menuAccessObject: menuData.menusData,
                errorMessage: ''
            }
            dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data
        } else {
            throw new AxiosError(res.internalMessage, res.status);
        }
    } catch (error: any) {
        console.log(error, `***********`)
        let errorMessageText = ``
        if (error.response.status === 401) {
            errorMessageText = `Invalid username or password. Please try again later.`;
        } else if (error.response.status === 404) {
            errorMessageText = `The requested resource was not found on the server.`;
        } else {
            errorMessageText = `An error occurred during login. Please try again later.`;
        }
        const errorMessage: any = { errorMessage: errorMessageText };
        dispatch({ type: ActionTypes.LOGIN_ERROR, payload: errorMessage });
        throw Error(errorMessageText);
    }
}

export const logout = async (dispatch: React.Dispatch<IAMClientAuthActions>) => {
    dispatch({ type: ActionTypes.LOGOUT });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}