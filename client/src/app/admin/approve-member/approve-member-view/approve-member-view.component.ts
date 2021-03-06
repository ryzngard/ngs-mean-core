import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TeamService } from 'src/app/services/team.service';
import { Profile } from '../../../classes/profile.class';
import { Team } from '../../../classes/team.class';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-approve-member-view',
  templateUrl: './approve-member-view.component.html',
  styleUrls: ['./approve-member-view.component.css']
})

export class ApproveMemberViewComponent implements OnInit {
  
  //component properties
  player = new Profile(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null); //local user profile - blank user profile
  viewTeam = new Team(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null); //local team profile - blank team profile
  resultantMmr: number //local var for holding returned resultant MMR calculation
  _info: any  //local var, holds the bindings passed to this component
  

  //Input bindings , object that has username and teamname
  @Input() set info(info){
    if(info!=null&&info!=undefined){
      this._info = info;
    }
  }

  //Output bindings
  @Output() accountActioned = new EventEmitter();

  //sends events to accountActioned output binding
  accountActioner() {
    this.accountActioned.emit(this._info);
  }

  constructor(private user:UserService, private team:TeamService, private admin:AdminService) { }

  //grabs appropriate team and user information based on privided input binding
  ngOnInit() {
    if(this._info.teamName && this._info.userName){
      this.user.getUser(this._info.userName).subscribe( res =>{
        this.player = res;
        this.team.getTeam(this._info.teamName).subscribe(resT => {
          this.viewTeam = resT;
          this.admin.resultantMmr(this.player.averageMmr, this.viewTeam.teamName_lower).subscribe(
            resmmr => {
              this.resultantMmr = resmmr.resultantMmr;
            },
            err => {
              console.log(err);
            }
          )
        })
      });

    }

  }

  //handles the approval chosen by the admin
  actionAccount(act){
    this.admin.queuePost(this.viewTeam.teamName, this.player.displayName, act).subscribe( res =>{
      this.accountActioner();
    }, err=>{
      console.log(err);
    });
  }

}
