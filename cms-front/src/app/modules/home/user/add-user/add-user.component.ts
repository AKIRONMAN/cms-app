import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserFormComponent} from "../user-form/user-form.component";
import {UserService} from "../../../../services/user.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('userFormComponent', {static: false}) userFormComponent: UserFormComponent | undefined;
  @Input() user: any;
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>();
  isApiRunning: boolean = false;
  constructor(private userService: UserService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    console.log('Student:::', this.user);
  }

  saveUser(){
    if(this.userFormComponent && typeof this.userFormComponent.isFormValid == 'function' && this.userFormComponent.isFormValid()){
      this.isApiRunning = true;
      let api = this.userService.add(this.userFormComponent.getValues());
      if(this.user && this.user.id){
        api = this.userService.update(this.user.id, this.userFormComponent.getValues());
      }
      api.subscribe((data: any) => {
          this.isApiRunning = false;
          this.closeModal({code: 200});
          console.log('Data: ', data);
        }, (error) => {
          this.toastrService.error(error.custom || error.server || error, 'Error');
          this.isApiRunning = false;
        });
    }
  }

  closeModal(value: any){
    console.log('data');
      this.closeDialog.emit(value);
  }


}
