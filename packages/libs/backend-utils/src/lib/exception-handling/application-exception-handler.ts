import { GlobalResponseObject } from "@xpparel/shared-models";
import { ErrorResponse } from "./global-res-object";

export const returnException = <T extends GlobalResponseObject>(classType: new (status: boolean, errorCode: number, internalMessage: string, data?: any) => T, errorObj: any): T => {
  let errorCode;
  let message;
  if (errorObj instanceof ErrorResponse) {
    errorCode = errorObj.errorCode;
    message = errorObj.message;
  } else if (errorObj instanceof Error) {
    errorCode = 0;
    message = errorObj.message;
  }
  const responseObj = new classType(false, errorCode, message);
  responseObj.status = false;
  responseObj.errorCode = errorCode;
  responseObj.internalMessage = message;
  return responseObj;
}


export const handleResponse = async <T extends GlobalResponseObject & { data?: any }>(
  action: () => Promise<T>,
  classType: new (status: boolean, errorCode: number, internalMessage: string, data?: any) => T
): Promise<T> => {
  try {
    const result = await action();
    return new classType(result.status, result.errorCode, result.internalMessage, result?.data);
  } catch (error) {
    let errorCode = 0;
    let message = 'An error occurred';

    if (error instanceof ErrorResponse) {
      errorCode = error.errorCode;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return new classType(false, errorCode, message);
  }
};
