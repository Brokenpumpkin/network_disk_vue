import axios from 'axios';

const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'http://127.0.0.1:51002',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        console.log(config)
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export const loginRequestApi = (option) => {
  return service({
    method: option.method,
    url: `${option.url}`,
    data: option.data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const requestApi = (option) => {
    if (option.isJson && JSON.stringify(option.data) !== {}) {
      return service({
        method: option.method,
        url: `${option.url}`,
        data: option.data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else if (option.isJson && JSON.stringify(option.data) === {}) {
      return service({
        method: option.method,
        url: `${option.url}`,
        data: option.data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else if (!option.isJson && JSON.stringify(option.data) !== {}) {
      return service({
        method: option.method,
        url: `${option.url}`,
        params: option.data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    } else if (!option.isJson && JSON.stringify(option.data) === {}) {
      return service({
        method: option.method,
        url: `${option.url}`
      })
    }
}


