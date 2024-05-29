import axios from 'axios';
import AxiosInstance from './Interceptor.tsx';
export default class Api {
  // ? post api call
  static async post(name: string, data: object) {
    return await AxiosInstance.post(name, data, {
      headers: {
        Authorization: axios.defaults.headers.common['Authorization'],
      },
    }).catch((error) => {
      console.log(
        name + ' error: ',
        JSON.stringify(error.response.data, null, 2)
      );
      return error.response.data;
    });
  }

  // ? get api call
  static async get(name: string) {
    return await AxiosInstance.get(name).catch((error) => {
      console.log(
        name + ' error: ',
        JSON.stringify(error.response.data, null, 2)
      );
      return error.response.data;
    });
  }

  // ? delete api call
  static async delete(name: string, params = {}) {
    return await AxiosInstance.delete(name, {
      data: params,
    }).catch((error) => {
      console.log(
        name + ' error: ',
        JSON.stringify(error.response.data, null, 2)
      );
      return error.response.data;
    });
  }

  // ? put api call
  static async put(name: string, params = {}) {
    return await AxiosInstance.put(name, {
      data: params,
    }).catch((error) => {
      console.log(
        name + ' error: ',
        JSON.stringify(error.response.data, null, 2)
      );
      return error.response.data;
    });
  }

  // ? put api call
  static async putImage(url: string, formData: FormData) {
    return await axios
      .put(url, formData, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'image/jpeg',
          Authorization: undefined,
        },
      })
      .catch((error) => {
        console.log('error.response', error.response);

        // console.log(url + ' error: ', JSON.stringify(error.response.data, null, 2));
        return error.response.data;
      });
  }
}
