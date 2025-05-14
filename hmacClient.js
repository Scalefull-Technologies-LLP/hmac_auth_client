const crypto = require('crypto');
const axios = require('axios');

class HmacClient {
  constructor(apiSecret, baseUrl) {
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl || 'http://localhost:3000';
  }

  post(endpoint, data) {
    return this._request('POST', endpoint, data);
  }


  _request(method, endpoint, data = {}) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const path = endpoint;
    const body = JSON.stringify(data);
    
    const dataToSign = `${timestamp}:${method}:${path}:${body}`;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(dataToSign)
      .digest('hex');

    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Timestamp': timestamp,
      'X-Signature': signature
    };

    return axios({
      method,
      url,
      data,
      headers
    });
  }
}

module.exports = HmacClient;