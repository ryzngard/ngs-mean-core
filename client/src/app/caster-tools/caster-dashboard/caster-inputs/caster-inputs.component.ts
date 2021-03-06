import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-caster-inputs',
  templateUrl: './caster-inputs.component.html',
  styleUrls: ['./caster-inputs.component.css']
})
export class CasterInputsComponent implements OnInit {

  constructor(private scheduleService:ScheduleService) { }

  hideForm = true;
  _id:string;

  name:string;
  URL: string;
  
  @Input() set matchId(id) {
    if (id != null && id != undefined) {
      this._id = id;
    }
  }

  casterNameControl = new FormControl('', [
    Validators.required
  ]);
  casterUrlControl = new FormControl('', [
    Validators.required
  ]);
  casterInputForm = new FormGroup({
    name: this.casterNameControl,
    url: this.casterUrlControl,

  })
  
  ngOnInit() {
  }

  saveCasterInfo(casterName, casterUrl) {
    let matchId;

    if (this._id != null && this._id != undefined){
      matchId = this._id;
      if (casterName != null && casterName != undefined) {
        if (casterUrl != null && casterUrl != undefined) {
          this.scheduleService.addCaster(matchId, casterName, casterUrl).subscribe(
            (res)=>{
              
            },
            (err)=>{

            }
          )
        }else{
          alert('Null Caster Url');
        }
      }else{
        alert('Null Caster Name');
      }
    }else{
      alert('Null MatchId');
    }
    
  }
}
