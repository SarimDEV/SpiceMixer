/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import axios from 'axios';
import 'react-native-get-random-values';

axios.defaults.baseURL = 'http://54.237.93.221:8080';
axios.interceptors.request.use(
  (request) => {
    // console.log(request);
    // Edit request config
    return request;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    // Edit response config
    return response;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  },
);

AppRegistry.registerComponent(appName, () => App);
