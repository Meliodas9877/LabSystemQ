import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowStudComponent } from './show-stud/show-stud.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import { StudentTypePipe } from './student-type.pipe';
import { GenderPipe } from './gender.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SearchStudentComponent } from './search-student/search-student.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  declarations: [
    ShowStudComponent,
    StudentTypePipe,
    GenderPipe,
    SearchStudentComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    NzMessageModule,
    NzRadioModule,
    NzDatePickerModule,
    NzModalModule,
    NzUploadModule,
  ],
  exports:[ShowStudComponent,SearchStudentComponent]
})
export class StudentModule { }
