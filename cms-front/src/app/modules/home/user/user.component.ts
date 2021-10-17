import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {NgModel} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
const _ = {
  remove: require('lodash/remove'),
  cloneDeep: require('lodash/cloneDeep')
};
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any = [];
  showLoader: boolean = true;
  selectedUser: any;
  reloadDialog: boolean = false;
  name: any;
  status: any;
  constructor(private userService: UserService, private toastrService: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.reloadDialog = true;
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getList()
      .subscribe((data: any) => {
        this.users = data;
        this.showLoader = false;
      }, (error: any) => {
        this.showLoader = false;
        this.toastrService.error('Having some error');
        console.log('Error::::', error);
      })
  }

  search(eventPoint: any, event: any){
    if(eventPoint === 'status'){
      this.status = event.target.value;
    }
    const object: any = {term: this.name || ''};
    if(this.status){
      object.isActive = this.status === 'active';
    }
    this.userService.search({params: object})
      .subscribe((data: any) => {
        this.users = data;
        this.showLoader = false;
      }, (error: any) => {
        this.showLoader = false;
        this.toastrService.error('Having some error');
        console.log('Error::::', error);
      })
  }

  addUser(modal: any){
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'})
      .result.then((result: any) => {
        if(result && typeof result === 'object'){
          console.log('AddedUser', result);
        }
      console.log('Result::::', result);
    });
  }

  closeDialog(modal: any, data: any){
    modal.dismiss();
    console.log('closeDialog', data);
    this.reloadDialog = false;
    if(typeof data != 'string'){
      console.log(data);
      if(this.selectedUser && this.selectedUser.id){
        this.toastrService.success('Updated success fully!');
      }else {
        this.toastrService.success('Added success fully!');
      }
      this.loadUsers();
    }
    this.selectedUser = null;
    this.reloadDialog = true;
  }

  editUser(modal: any, user: any){
    this.reloadDialog = true;
    this.selectedUser = _.cloneDeep(user);
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'})
      .result.then((result: any) => {
      if(result && typeof result === 'object'){
        console.log('AddedUser', result);
        this.loadUsers();
      }
      console.log('Result::::', result);
    });
  }

  deleteUser(user: any){
    this.userService.deleteUser(user.id)
      .subscribe((response) => {
        _.remove(this.users, (userObj: any) => {return userObj.id === user.id});
         this.toastrService.success('User Delete Successfully!', 'Success');
      }, (error: any) => {
        this.toastrService.error(error.custom || error.server || error.message || error, 'Error')
      });
  }

  logout(){

    this.userService.logout();
  }
}
