
import axios, { AxiosInstance } from 'axios';

class PostService {

  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string = 'https://min-api.cryptocompare.com/data/v2';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  load(): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/news/`);
  }

}

export default new PostService();