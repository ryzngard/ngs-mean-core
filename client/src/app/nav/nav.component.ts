import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { DivisionService } from '../services/division.service';
import { MessagesService } from '../services/messages.service';
import { NotificationService } from '../services/notification.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userName: string
  teamName: string
  divisions
  navBarClass: string = 'collapse navbar-collapse';
  userMessages:number=0;

  constructor(public Auth:AuthService, private socket:Socket, private router: Router, public team:TeamService, public user:UserService, private divisionService: DivisionService, private messages:MessagesService,
    private notificationService:NotificationService) {
      if(this.Auth.isAuthenticated()){
        this.user.heartbeat().subscribe(res=>{

        },err=>{

        });
      }
      this.notificationService.updateLogin.subscribe(
        res=>{
          this.ngOnInit();
        }
      )
     }

  navGo(toggleOrRemove?){
    if(toggleOrRemove == 'remove'){
      this.navBarClass = removeShow(this.navBarClass);
    }else{
      this.navBarClass = toggleShow(this.navBarClass);
    }
    // if (!appRoute && !path){
    //   //hamburger
    //   this.navBarClass = toggleShow(this.navBarClass);
    // }
    // else if(path != null && path != undefined && path.length>0){
    //   this.router.navigateByUrl(appRoute+path);
    //   this.navBarClass = removeShow(this.navBarClass);
    // }else{
    //   this.router.navigateByUrl(appRoute);
    //   this.navBarClass = removeShow(this.navBarClass);
    //   //nah
    // }
  }

  logout(){
    this.navBarClass = removeShow(this.navBarClass);
    this.Auth.destroyAuth('/logout');
  }

  ngOnInit() {

    this.divisionService.getDivisionInfo().subscribe( res => {
      this.divisions = res;
    }, err=>{
      console.log(err);
    });

    this.messages.getMessageNumbers(this.Auth.getUserId()).subscribe( (res)=>{
      if(res){
        if(res){
          this.userMessages = parseInt(res);
        }
        
      }
    }, err=>{
      console.log(err);
    })

    if(this.Auth.getTeam()){
      this.teamName = this.Auth.getTeam();
    }
    if(this.Auth.isAuthenticated()){
      this.userName=this.Auth.getUser();
    }
    if(this.Auth.getUserId()){
      this.socket.emit('storeClientInfo', { userId: this.Auth.getUserId() });
    }
    this.socket.fromEvent('newMessage').subscribe(
      res=>{
        console.log('message from socket IO')
        this.userMessages+=1;
        console.log(this.userMessages);
      },
      err=>{
        console.log(err);
      }
    )
    //updates the unread messages bubble...
    this.notificationService.updateMessages.subscribe(
      message=>{
        this.messages.getMessageNumbers(this.Auth.getUserId()).subscribe((res) => {
          if(res){
            this.userMessages = res;
          }else{
            this.userMessages = 0;
          }
          
        }, err => {
          console.log(err);
        });
      }
    )

  }


}

function removeShow(str){
  let strArr = str.split(' ');
  let index = strArr.indexOf('show');
  if (index > - 1) {
    strArr.splice(index, 1);
  }
  return strArr.join(' ');
}

function toggleShow(str){
  let strArr = str.split(' ');
  let index = strArr.indexOf('show');
  if(index >- 1){
    strArr.splice(index, 1);
  }else{
    strArr.push('show');
  }
  return strArr.join(' ');
}
