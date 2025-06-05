import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Signup, Profile } from '../model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  registerUser(obj: Signup): Observable<Signup> {
    return this.http.post<Signup>(
      'http://localhost/php-crud/api/v1/auth/signup/',
      obj
    );
  }
  loginUser(res: Login): Observable<Login> {
    return this.http.post<Login>(
      'http://localhost/php-crud/api/v1/auth/login/',
      res
    );
  }
  profile(): Observable<Profile> {
    return this.http.get<Profile>(
      'http://localhost/php-crud/api/v1/myprofile/'
    );
  }
  users(): Observable<any> {
    return this.http.get<any>('http://localhost/php-crud/api/v1/users/');
  }
  updateProfile(res: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost/php-crud/api/v1/updateuser/`,
      res
    );
  }
  country(): Observable<any> {
    return this.http.get<any>('http://localhost/php-crud/api/v1/country/');
  }
  state(data: any): Observable<any> {
    return this.http.post<any>('http://localhost/php-crud/api/v1/state/', data);
  }
  city(data: any): Observable<any> {
    return this.http.post<any>('http://localhost/php-crud/api/v1/city/', data);
  }
  changePassword(data: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost/php-crud/api/v1/changepassword/',
      data
    );
  }
  projects(
    startRow: number,
    endRow: number,
    search: any = '',
    sortModel: any[] = [],
    filterModel: any = {}
  ): Observable<any> {
    const sort =
      sortModel.length > 0 ? `${sortModel[0].colId}_${sortModel[0].sort}` : '';
    const params = {
      startRow: startRow,
      endRow: endRow,
      search: search,
      sort: sort,
      filterModel: decodeURIComponent(JSON.stringify(filterModel)),
    };

    return this.http.get(`http://localhost/php-crud/api/v1/projects/`, {
      params,
    });
  }
  createProject(data: any): Observable<any> {
    return this.http.post(
      'http://localhost/php-crud/api/v1/createproject/',
      data
    );
  }
  updateProject(data: any, id: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost/php-crud/api/v1/updateproject/?id=${id}`,
      data
    );
  }
  deleteProject(id: any): Observable<any> {
    return this.http.delete<any>(
      `http://localhost/php-crud/api/v1/deleteproject/?id=${id}`
    );
  }
  getProject(id: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost/php-crud/api/v1/getproject/?id=${id}`
    );
  }
}
