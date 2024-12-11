
import { Functions } from '../utils';

import Axios from 'axios';

import URL from './URL';

const REQUEST = async ({
  Method,
  EndPoint,
  Params,
  IsformData = false,
  NeedToken = true,
}) => {
  const appData = await Functions.getAppData();
  const Headers = Header(NeedToken, appData?.User?.token, IsformData);
  const options = {
    method: Method,
    headers: Headers,
    data: Params,
    url: URL.AppUrl + EndPoint,
  };
  // console.log('options -> ', JSON.stringify(options, null, 2));
  // const response = await Axios(options);
  // return response.data;
  const response = await Axios(options)
    .then(response => {
      // console.log('response 123 ::', response.data);
      return response.data;
    })
    .catch(error => {
      // console.log('error 123 ::', error?.response);
      throw error?.response?.data?.title
        ? {
            msg: error?.response?.data?.title,
            status: error?.response?.data?.status,
          }
        : error?.message;
    });
  return response;
};
const Header = (NeedToken, Token, IsformData) => {
  let apiHeaders = {
    Accept: '*/*',
    'Content-Type': IsformData ? 'multipart/form-data' : 'application/json',
  };
  if (NeedToken) {
    apiHeaders = {...apiHeaders, Authorization: `Bearer ${Token}`};
  }
  return apiHeaders;
};
export default REQUEST;
