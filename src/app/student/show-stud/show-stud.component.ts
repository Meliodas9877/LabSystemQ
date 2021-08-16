import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Student } from './student';
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Observer,Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { Result } from 'src/app/result';
import { Page } from 'src/app/page';

@Component({
  selector: 'app-show-stud',
  templateUrl: './show-stud.component.html',
  styleUrls: ['./show-stud.component.scss'],
})
export class ShowStudComponent implements OnInit {
  infoForm!: FormGroup;
  searchTerm: string = '';
  students: Student[] = [];
  oriStudents: Student[] = [];
  mode: string = '';
  students$!: Observable<Result<Page<Student>>>;

  student: Student = {
    studentId: null,
    studentName: null,
    gender: null,
    schoolYear: null,
    telephone: null,
    email: null,
    studentType: null,
    idNo: null,
    avatarUrl:null,
  };
  validateForm: FormGroup;
  isVisible = false;
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项',
    },
    en: {
      required: 'Input is required',
    },
    default: {
      email: '邮箱格式不正确',
    },
  };

  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  sortField: string | null;
  sortOrder: string | null;
  filters: Array<{ key: string; value: string[]}>|[]
  filterGender = [
    { text: '男', value: 'M' },
    { text: '女', value: 'F' },
  ];
  filterType = [
    { text: '博士', value: 'D' },
    { text: '硕士', value: 'M' },
  ];
  avatarUrl?: string;

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        this.studentService.checkStudId(control.value).subscribe((res) => {
          if (res.count) {
            if (this.mode === 'add') {
              observer.next({
                duplicated: {
                  'zh-cn': `学号已存在`,
                  en: `The student Id is redundant!`,
                },
              });
            } else {
              observer.next(null);
            }
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      }, 300 );
    });

  constructor(
    private studentService: StudentService, 
    private message: NzMessageService,
    private fb: FormBuilder,

  ) {
    const { mobile, maxLength, minLength, number, idNo } = MyValidators;
    this.infoForm = this.fb.group({
      studentId: [
        null,
        [Validators.required, maxLength(12), minLength(12), number],
        [this.userNameAsyncValidator],
      ],
      studentName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      schoolYear: [null],
      telephone: [null, [Validators.required, mobile]],
      email: [null, [Validators.required, Validators.email]],
      studentType: [null, [Validators.required]],
      idNo: [null, [Validators.required, idNo]],
    });
  }

  ngOnInit(): void {
    this.refresh(this.pageIndex, this.pageSize, null, null, null, []);
    this.students$ = this.searchTerm$.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),
    
      // ignore new term if same as previous term
      distinctUntilChanged(),
    
      // switch to new search observable each time the term changes
      switchMap((searchTerm: string) => this.studentService
      .getStudents(
        this.pageIndex,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        searchTerm,
        this.filters,
      )),
    );
    this.students$.subscribe((res) => {
      this.loading = false;
      this.students = res.data.data;
      this.total = res.data.total;
      console.log(this.total);
    });
  }

  refresh(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    searchTerm: string | null,
    filter: Array<{ key: string|null; value: string[]|null}>
  ): void {
    console.log(filter)
    this.loading = true;
    this.studentService
      .getStudents(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        searchTerm,
        filter
      )
      .subscribe((result) => {
        this.oriStudents = result.data.data;
        this.students = result.data.data;
        this.loading = false;
        this.total = result.data.total;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    const searchTerm = this.searchTerm || null;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    this.searchTerm = searchTerm;
    this.filters = filter;
    this.refresh(pageIndex, pageSize, sortField, sortOrder, searchTerm, filter);
  }

  private searchTerm$ = new Subject<string>();
  onSend(searchTerm: string) {
    console.log(searchTerm);
    this.searchTerm$.next(searchTerm);
    console.log(this.searchTerm$);
    this.searchTerm = searchTerm;
    this.pageIndex = 1;
    
  }

  cancel() {
    this.isVisible = false;
    this.infoForm.reset();
  }

  submitForm(value: {
    studentId: string;
    studentName: string;
    gender: string;
    telephone: string;
    email: string;
    studentType: string;
    idNo: string;
  }): void {
    for (const key in this.infoForm.controls) {
      if (this.infoForm.controls.hasOwnProperty(key)) {
        this.infoForm.controls[key].markAsDirty();
        this.infoForm.controls[key].updateValueAndValidity();
      }
    }
    setTimeout(()=>{
    if (this.infoForm.valid){
      if (this.mode === 'add') {
        this.studentService.addStudent(this.infoForm.value).subscribe((res) => {
          if (res.code === 1000) {
            this.message.success('新增成功');
            this.isVisible = false;
            this.infoForm.reset();
            this.refresh(this.pageIndex, this.pageSize, null, null, null, []);
          } else {
            this.message.error(res.message);
          }
        });
      }
      if (this.mode === 'update') {
        this.studentService
          .updateStudent(this.infoForm.value)
          .subscribe((res) => {
            if (res.code === 1000) {
              this.message.success('修改成功');
              this.isVisible = false;
              this.infoForm.reset();
              this.refresh(this.pageIndex, this.pageSize, null, null, null, []);
            } else {
              this.message.error(res.message);
            }
          });
      }}
    },500)
    console.log(this.infoForm.value);
  }

  addStudent() {
    this.isVisible = true;
    this.mode = 'add';
    this.infoForm.patchValue({ gender: 'M', studentType: 'D' });
  }

  updateStudent(student: Student) {
    this.mode = 'update';
    this.infoForm.setValue(student);
    this.isVisible = true;
  }

  deleteStudent(student: Student) {
    this.studentService.deleteStudent(student).subscribe((res) => {
      if (res.code === 1000) {
        this.message.success('删除成功');
        this.refresh(this.pageIndex, this.pageSize, null, null, null, []);
      } else {
        this.message.error(res.message);
      }
    });
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[],) =>
  new Observable((observer: Observer<boolean>) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('You can only upload JPG file!');
      observer.complete();
      return;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must smaller than 2MB!');
      observer.complete();
      return;
    }
    observer.next(isJpgOrPng && isLt2M);
    observer.complete();
  });
  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  phoBelong=(stud:Student)=>{
    return{
      studentId:stud.studentId
    }

  }
  handleChange(info: { file: NzUploadFile}): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
          this.refresh(this.pageIndex, this.pageSize, null, null, null, [])
          console.log(img)
        });
        break;
      case 'error':
        this.message.error('Network error');
        this.loading = false;
        break;
    }
  }
}

export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<
  string,
  NzSafeAny
>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return {
        minlength: {
          'zh-cn': `长度应为 ${minLength}`,
          en: `MinLength is ${minLength}`,
        },
      };
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          'zh-cn': `长度应为 ${maxLength}`,
          en: `MaxLength is ${maxLength}`,
        },
      };
    };
  }

  static number(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;
    if (isEmptyInputValue(value)) {
      return null;
    }

    return isNumber(value)
      ? null
      : {
          number: {
            'zh-cn': `学号应为12位数字`,
            en: `Mobile phone number is not valid`,
          },
        };
  }
  static mobile(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isMobile(value)
      ? null
      : {
          mobile: {
            'zh-cn': `手机号码格式不正确`,
            en: `Mobile phone number is not valid`,
          },
        };
  }
  static idNo(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isidNo(value)
      ? null
      : {
          idNo: {
            'zh-cn': `身份证号格式不正确`,
            en: `Mobile phone number is not valid`,
          },
        };
  }
}

function isEmptyInputValue(value: NzSafeAny): boolean {
  return value == null || value.length === 0;
}
function isMobile(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
      value
    )
  );
}
function isNumber(value: string): boolean {
  return typeof value === 'string' && /^[0-9]*$/.test(value);
}
function isidNo(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      value
    )
  );
}
