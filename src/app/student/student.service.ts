import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, validator } from '../result';
import { Student } from './show-stud/student';
import { catchError } from 'rxjs/operators';
import { Page } from '../page';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getStudents(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    searchTerm:string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<Result<Page<Student>>> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`)
      .append('searchTerm',`${searchTerm}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
      return this.http.get<Result<Page<Student>>>(
        'http://127.0.0.1:8000/stu/',{params}  
      );
  }

  addStudent(student): Observable<Result<Student[]>> {
    return this.http.post<Result<Student[]>>(
      'http://127.0.0.1:8000/stu/',
      student
    );
  }

  updateStudent(student): Observable<Result<Student[]>> {
    return this.http.put<Result<Student[]>>(
      'http://127.0.0.1:8000/stu/',
      student
    );
  }
  deleteStudent(student): Observable<Result<Student[]>> {
    return this.http.delete<Result<Student[]>>(
      'http://127.0.0.1:8000/stu/?studentId=' + student.studentId
    );
  }

  checkStudId(studentId:any ):Observable<validator>{
    return this.http.get<validator>(
      'http://127.0.0.1:8000/vali/',{params:{studentId:studentId}}
    );
  }
}
