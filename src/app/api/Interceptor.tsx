import axios from 'axios';
const SERVER_URL = 'https://healthcareintourism-test.azurewebsites.net/swagger/index.html?classId=79a6f82e-4333-493c-bca6-c5ce652c6c6e&assignmentId=a9047589-f065-44c4-9724-4028e0660f6e&submissionId=9ea2c427-c762-2884-4009-207a0cdb3828/api/';
const AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});
AxiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log('api error: ', JSON.stringify(error.response, null, 2));
    if (!error.response) {
      return Promise.reject('Network Error');
    } else {
      return error.response.data;
    }
  }
);
// ? kaynak: https://stackoverflow.com/questions/51247788/rn-axios-how-to-add-an-axios-interceptor-in-saga-react-native

export default AxiosInstance;
