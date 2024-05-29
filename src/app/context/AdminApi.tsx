import { encodeQuery } from '../common/commonUtils.tsx';
import fetch from '../api/fetch.tsx';

export const API_URL = 'https://healthcareintourism-test.azurewebsites.net/api';


export const registerAgency = async (name: string, agencyName:string, agencyEmailAddress: string , isActive: boolean ) => {
  try {
    const queryParams = { name, agencyName, agencyEmailAddress, isActive};
    const url = `${API_URL}/Account/register-agency`;
    const response = await fetch.post(url, queryParams);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data,
    };
  }
};


//AWSS

export const uploadAWSS = async (base64String: string ) => {
    try {
      const queryParams = {base64String}
      const url = `${API_URL}/AWSS/Upload`;
      const response = await fetch.post(url, queryParams);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data.key;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.key,
      };
    }
  };
export const downloadAWSS = async (key ?: number) => {
  try {
    const queryParams = encodeQuery({ key });
    const url = `${API_URL}/AWSS/Download${queryParams}`;
    const response = await fetch.get(url);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data,
    };
  }
};
export const deleteAWSS = async (key: number) => {
  try {
    const queryParams = encodeQuery({ key });
    const url = `${API_URL}/AWSS/Delete`;
    const response = await fetch.delete(url, queryParams);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data,
    };
  }
};