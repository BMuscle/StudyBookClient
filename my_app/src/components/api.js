import axios from 'axios'

axios.defaults.baseURL = 'http://bgmuscle.ddns.net'
axios.defaults.baseURL = 'http://192.168.11.50'
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

export default {
  request(method, url, options) {
    var promise = null
    var params = {}
    var headers = {}

    if (options.params) {
      // リクエストパラメーターのセット
      params = options.params
    }
    if (options.headers) {
      // カスタムヘッダーのセット
      headers = options.headers
    }

    promise = axios({
      method: method,
      url: url,
      data: params,
      headers: headers
    })

    promise.catch(function() {
      return console.log(promise)
    })
    return promise
  },
  get(url, options = {}) {
    return this.request('get', url, options)
  },
  post(url, params = {}, options = {}) {
    return this.request('post', url, { params: params }, options)
  },
  patch(url, params = {}, options = {}) {
    return this.request('patch', url, { params: params }, options)
  },
  delete(url, params = {}, options = {}) {
    return this.request('delete', url, { params: params }, options)
  }
}
