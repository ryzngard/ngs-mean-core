import { Component, OnInit, Input, Output, EventEmitter, DoCheck, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-times-available',
  templateUrl: './times-available.component.html',
  styleUrls: ['./times-available.component.css']
})
export class TimesAvailableComponent implements OnInit, DoCheck {
  
  
  availability = {
    "monday": {
      "available": false,
      "startTime": null,
      "endTime": null
    },
    "tuesday": {
      "available": false,
      "startTime": null,
      "endTime": null
    },
    "wednesday": {
      "available": false,
      "startTime": null,
      "endTime": null
    }
    , "thursday": {
      "available": false,
      "startTime": null,
      "endTime": null
    }
    , "friday": {
      "available": false,
      "startTime": null,
      "endTime": null
    }
    , "saturday": {
      "available": false,
      "startTime": null,
      "endTime": null
    }
    , "sunday": {
      "available": false,
      "startTime": null,
      "endTime": null
    }
  };
  errorAvail: boolean = false;
  errorReply: string = '';
  differ: any

  hell(){
    console.log(this.availability)
  }
  constructor(private util: UtilitiesService) { 
   
  }

  ngOnInit() {
  }

 
  @Input() set availObj(_obj){
    if(typeof _obj == 'object' && _obj != null && _obj != undefined){
      this.availability = Object.assign({},_obj);
    }
  }

  displayText: string ='Times the team plays and practices:';
  @Input() set customText(_text){
    if (typeof _text == 'string' && _text != null && _text != undefined){
      this.displayText = _text;
    }
  }

  editOn:boolean=false;
  @Input() set disabled(_editOn) {
    if (typeof _editOn == 'boolean' && _editOn != null && _editOn != undefined) {
      this.editOn = _editOn;
    }
  }

  ngDoCheck() {
   this.checkAvailabilityDays();
  }

  @Output() availValid = new EventEmitter();

  emitValid(){
    this.availValid.emit('?');
  }

  modelChange(){
    console.log('model is changing!')
  }


  //check that the availability exists and that at least one day has been set to true and has time
  checkAvailabilityDays(): void {
    let ret = true;
    let nodays = 0;
      //validate that we have start and end times for available days
      for (let day in this.availability) {
        let checkDay = this.availability[day];
        if (checkDay.available) {
          if (checkDay.startTime == null || checkDay.startTime.length == 0) {
            this.errorReply = day.substring(0, 1).toUpperCase() + day.substring(1, day.length) + " start time required!";
            ret = false;
          } else if (checkDay.endTime == null || checkDay.endTime.length == 0) {
            this.errorReply = day.substring(0, 1).toUpperCase() + day.substring(1, day.length) + " end time required!";
            ret = false;
            ret = false;
          } else if (false) {
            ret = false;
          } else {
            let endTimeStrArr = checkDay.endTime.split(':');
            let endTime = new Date();
            endTime.setMinutes(endTimeStrArr[1]);
            endTime.setHours(endTimeStrArr[0]);
            let startTime = new Date();
            let startTimeStrArr = checkDay.startTime.split(':');
            startTime.setMinutes(startTimeStrArr[1]);
            startTime.setHours(startTimeStrArr[0]);
            if (startTime >= endTime) {
              this.errorReply = day.substring(0, 1).toUpperCase() + day.substring(1, day.length) + " end time must be later than start time!";
              ret = false;
            }
          }
        } else {
          nodays += 1;
        }
      }
    if (nodays == 7) {
      ret = false;
      this.errorReply = 'Must include at least 1 day of availability';
    }
    if (ret) {
      this.errorReply = '';
    }
    this.errorAvail = !ret;
    this.availValid.emit(ret);
  }

}