import { Component, OnInit, NgModule, Input} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { TimezoneService } from '../services/timezone.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Profile } from '../classes/profile.class';
import { Observable, Subscription } from 'rxjs';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { merge } from 'lodash';
import { HotsLogsService } from '../services/hots-logs.service';
import { Router } from '@angular/router';
import { DeleteConfrimModalComponent } from '../modal/delete-confrim-modal/delete-confrim-modal.component'
import { UtilitiesService } from '../services/utilities.service';

@NgModule({
  imports:[
    ReactiveFormsModule
  ]
})

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  navigationSubscription

  constructor(public timezone: TimezoneService, private user: UserService, public auth: AuthService, private router: Router, private route: ActivatedRoute, 
    public hotsLogsService: HotsLogsService, public dialog: MatDialog, private util:UtilitiesService) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.displayName = user.realUserName(this.route.snapshot.params['id']);
        this.ngOnInit();
      }
    });
    
  }

  showInvite = false;
  editOn = true;

  hotsLogsFormControl = new FormControl({value:'',disabled:true} ,[
    // Validators.required,
    this.hotslogsUrlPatternValidator
  ]);

  discordTagFormControl = new FormControl({ value: '', disabled: true }, [
    Validators.required,
    this.discordPatternValidator
  ]);

  heroeLeagueDivisionControl = new FormControl({ value: '',disabled:true}, [
    // Validators.required
  ]);

  heroeLeagueRankControl = new FormControl({ value: '', disabled: true }, [
    // Validators.required
  ]);

  timezoneControl = new FormControl({ value: '', disabled: true }, [
    // Validators.required
  ]);

  timesAvailControl = new FormControl();

  discordPatternValidator(control: FormControl){
    let discordTag = control.value;
    if (discordTag){
      if (discordTag && discordTag.indexOf('#') <= 0) {
        return { invalidTag: true }
      } else {
        let tagArr = discordTag.split('#');
        let regex = new RegExp(/(\d{4})/);
        if (tagArr[1].length == 4 && regex.test(tagArr[1])) {
          return null;
        } else {
          return { invalidTag: true }
        }
      }
    }else{

    }
  }

  hotslogsUrlPatternValidator(control: FormControl) {
  let hotslogsURL = control.value;
    let regex = new RegExp(/^((https):\/)\/www\.hotslogs\.com\/player\/profile\?playerid\=[0-9]+/, 'i');
    if (regex.test(hotslogsURL)) {
      return null;
  }else{
      return {
        invalidurl:true
        }
      };
  }

  profileForm = new FormGroup({
    discordTag: this.discordTagFormControl,
    hlDivision: this.heroeLeagueDivisionControl,
    hlRank: this.heroeLeagueRankControl,
    timezone: this.timezoneControl,
    timeAvail:this.timesAvailControl
  })

formControlledEnable(){
  this.hotsLogsFormControl.enable();
  this.discordTagFormControl.enable();
  this.heroeLeagueDivisionControl.enable();
  this.heroeLeagueRankControl.enable();
  this.timezoneControl.enable();
}

  formControlledDisable(){
    this.hotsLogsFormControl.disable();
    this.discordTagFormControl.disable();
    this.heroeLeagueDivisionControl.disable();
    this.heroeLeagueRankControl.disable();
    this.timezoneControl.disable();
  }

  providedProfile:string;
  @Input() set passedProfile(profile){
    if(profile!=null&&profile!=undefined){
      this.providedProfile = profile;
      this.ngOnInit();
    }
  }

  showInviteToTeamButton(){
    if ((this.returnedProfile.teamId == null || this.returnedProfile.teamId == undefined)
      &&  (this.returnedProfile.teamName == null || this.returnedProfile.teamName == undefined )
      && (this.returnedProfile['pendingTeam'] == null || this.returnedProfile['pendingTeam'] == undefined || this.returnedProfile['pendingTeam'] == false)) {
      if (this.auth.getCaptain() === 'true'){
        this.showInvite = true;
      }else{
        this.showInvite = false;
      }
    }else{
      this.showInvite = false;
    }
  }

  confirm: string

  openDialog(): void {
    
    const dialogRef = this.dialog.open(DeleteConfrimModalComponent, {
      width: '300px',
      data: { confirm: this.confirm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase()=='delete'){
        this.user.deleteUser().subscribe(
          res =>{
          this.auth.destroyAuth('/logout');
         },err=>{
            console.log(err);
          }
        )
      }
    });
  }

  answers: object;
  selectedMedal: string;
  displayName : string;
  profileObs : Observable<Profile>;
  returnedProfile = new Profile(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

  dataRet = false;
  profSub: Subscription;
  tempProfile: Profile;

  hlMedals = ['Grand Master','Master','Diamond','Platinum','Gold','Silver','Bronze','Unranked'];
  hlDivision = [1,2,3,4,5];

  competitonLevel = [
    { val: 1, display: 'Low' },
    { val: 3, display: 'Medium' },
    { val: 5, display: 'High' }
  ]
  
  hideLookingForGroup(){
    if(this.auth.getTeam()){
      return false;
    }else{
      return true;
    }
  }

   hideDay(editSwitch, dayAvailabilty): boolean {
     if (!editSwitch){
      return false;
     }else{
       if(dayAvailabilty){
         return false;
       }else{
         return true;
       }
     }
   }

  markFormGroupTouched(formGroup: FormGroup) {

  if (formGroup.controls) {
    const keys = Object.keys(formGroup.controls);
    for (let i = 0; i < keys.length; i++) {
      const control = formGroup.controls[keys[i]];

      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    }
  }
}

   openEdit(){
     this.editOn=false;
     this.formControlledEnable();
     this.markFormGroupTouched(this.profileForm);
     this.tempProfile = new Profile(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
     merge(this.tempProfile, this.returnedProfile);
   }

   cancel(){
     this.returnedProfile = Object.assign({}, this.tempProfile);
     this.editOn = true;
     this.formControlledDisable();
   }

   hotsLogsUrlReq = false;

   save(){
     if(this.validate()){

      this.util.updateAvailabilityToNum(this.returnedProfile);
      //  let keys = Object.keys(this.returnedProfile.availability);
      //  keys.forEach(element => {
      //    let obj = this.returnedProfile.availability[element];
      //    if (obj.available) {
      //      obj['startTimeNumber'] = this.util.convertToMil(obj.startTime);
      //      obj['endTimeNumber'] = this.util.convertToMil(obj.endTime);
      //    }
      //  });

       if(!this.hotsLogsUrlReq){
         this.hotsLogsService.getMMRdisplayName(this.user.routeFriendlyUsername(this.returnedProfile.displayName)).subscribe(
           res => {

             if (res != 'error') {
               this.returnedProfile.averageMmr = res.avgMMR;
               this.returnedProfile['hotsLogsPlayerID'] = res.PlayerID;
               this.user.saveUser(this.returnedProfile).subscribe((res) => {
                 if (res) {
                   this.editOn = true;
                   this.formControlledDisable();
                 } else {
                   alert("error");
                 }
               });
             } else {
               alert('We could not validate your hots logs, please recheck the URL!');
               this.hotsLogsUrlReq = true;
               this.cancel();
             }
           }
         )
       }

       if (this.hotsLogsUrlReq){

         this.hotsLogsService.getMMR(this.returnedProfile.hotsLogsURL).subscribe(res => {
           if (res != 'error') {
             this.returnedProfile.averageMmr = res.avgMMR;
             this.returnedProfile['hotsLogsPlayerID'] = res.PlayerID;
             this.user.saveUser(this.returnedProfile).subscribe((res) => {
               if (res) {
                 this.editOn = true;
                 this.formControlledDisable();
               } else {
                 alert("error");
               }
             });
            }else{
              alert('We could not validate your hots logs, please recheck the URL!');
              this.cancel();
            }

         });
       }else{
         this.user.saveUser(this.returnedProfile).subscribe((res) => {
           if (res) {
             this.editOn = true;
             this.formControlledDisable();
           } else {
             alert("error");
           }
         });
       }
     }else{
       console.log('the data was invalid we cant save');
     }
   }

  timezoneUpdate(){
    if (this.returnedProfile.timeZone != null || this.returnedProfile.timeZone!=undefined){
      this.timezoneControl.setErrors(null);
    }
  }

  ngOnInit() {   
    let getProfile:string;
    if(this.providedProfile){
      getProfile = this.providedProfile;
    }else if(this.displayName){
      getProfile = this.displayName;
    }
    this.profSub = this.user.getUser(getProfile).subscribe((res) => { 
      merge(this.returnedProfile, res);
      this.showInviteToTeamButton() 
      } )
  }

  validAvailTimes:boolean=false;
  vaildAvailDays:number=0;
  recieveAvailTimeValidity(event){
    this.validAvailTimes = event.valid;
    this.vaildAvailDays = event.numdays
    if(event.valid){
      this.timesAvailControl.setErrors(null);
    }else{
      this.timesAvailControl.setErrors({ invalid: true });
    }
    if (event.numdays > 0 && this.isNullOrEmpty(this.returnedProfile.timeZone)) {
      this.timezoneControl.setErrors({ required: true });
    } else {
      this.timezoneControl.setErrors(null);
    }
  } 
  
  modifyForm(metal){
    if(metal == 'Unranked'){
      this.heroeLeagueRankControl.setErrors(null);
    }else{
      
    }
  }

  validate(){
    let valid = true;
    //validate the hotslogs URL
    if (this.hotsLogsUrlReq && (this.isNullOrEmpty(this.returnedProfile.hotsLogsURL) ||
      this.returnedProfile.hotsLogsURL.indexOf('https://www.hotslogs.com/Player/Profile?PlayerID=') == -1)){
      valid = false;
    }

    //validate the hero leauge information
    // if (this.returnedProfile.hlRankMetal == 'Unranked'){
    //   valid = true;
      
    // }else if (this.isNullOrEmpty(this.returnedProfile.hlRankMetal) && this.isNullOrEmpty(this.returnedProfile.hlRankDivision)){
    //   valid = false;
    // }

    //validate looking for team:
    // if (this.isNullOrEmpty(this.returnedProfile.lookingForGroup)) {
    //   valid = false;
    // }

    //will we require the comp level, play history, roles?

    //validate that we have start and end times for available days
    if(!this.validAvailTimes){
      valid=false;
      this.timesAvailControl.setErrors({invalid:true});
    }else{
      this.timesAvailControl.setErrors(null);
    }

    //ensure time zone
    if (this.vaildAvailDays>0 && this.isNullOrEmpty(this.returnedProfile.timeZone)) {
      this.timezoneControl.setErrors({ required: true });
    } else {
      this.timezoneControl.setErrors(null);
    }
    return valid;
  }

  isNullOrEmpty( dat ) : boolean {
    if(dat == null || dat == undefined){
      return true;
    }
    if(Array.isArray(dat)){
      if(dat.length==0){
        return true;
      }
    }else if( typeof dat == 'object' ){
      let noe = false;
      for(let key in dat){
        if(this.isNullOrEmpty(dat[key])){
          noe = true;
        }
      }
      return noe;
    }else if(typeof dat == "string"){
      return dat.length==0;
    }else{
      return false;
    }
  }

  ngOnDestroy(){
    this.profSub.unsubscribe();
  }
}
