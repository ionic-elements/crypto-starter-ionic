import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostModel } from 'src/app/models/post-model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  load(): Promise<any> {
    const url = `https://min-api.cryptocompare.com/data/v2/news/`;
    return this.http.get(url).toPromise();
  }
}