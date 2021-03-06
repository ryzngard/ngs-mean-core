import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { AdminService } from 'src/app/services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-match-management',
  templateUrl: './match-management.component.html',
  styleUrls: ['./match-management.component.css']
})
export class MatchManagementComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  //component properties
  hideForm = true;
  selectedRound: any
  selectedDivision: any
  originalMatches: any
  filterMatches: any
  filterTeam: any
  rounds = [];
  divisions = []

  constructor(private scheduleService: ScheduleService, private adminService: AdminService, public util: UtilitiesService) { }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
  }

  ngOnInit() {
    this.adminService.getDivisionList().subscribe((res) => {
      this.divisions = res;
      this.scheduleService.getAllMatches().subscribe(
        (sched) => {
          this.originalMatches = sched;
          this.filterMatches = sched;
          this.filterMatches.forEach(match => {
            match.submitCaster = {
              "name": '',
              "URL": ''
            }
            if (this.rounds.indexOf(match.round) < 0) {
              this.rounds.push(match.round);
            }
          });
          this.rounds.sort();
          this.length = this.filterMatches.length;
          this.displayArray = this.filterMatches.slice(0, this.pageSize);
        }
      )
    }, (err) => {
      console.log(err);
    });
  }

  displayArray = [];
  length: number;
  pageSize: number = 10;
  filteredArray: any = [];
  pageIndex: number;

  pageEventHandler(pageEvent: PageEvent) {
    
    let i = pageEvent.pageIndex * this.pageSize;
    let endSlice = i + this.pageSize
    if (endSlice > this.filterMatches.length) {
      endSlice = this.filterMatches.length;
    }
    
    this.displayArray = [];
    this.displayArray = this.filterMatches.slice(i, endSlice)

  } 

  /*
  div, round, team
  div, round, 
  div, team,
  round, team,
  div, 
  round, 
  team
  */
 //filters the matches based on selected criteria
  doFilterMatches(div, round, team) {
    
    this.filterMatches = this.originalMatches.filter(match => {
      let home, away;
      console.log(match);
      if(!this.util.returnBoolByPath(match, 'away.teamName')){
        away = '';
      }else{
        away = match.away.teamName.toLowerCase();
      }
      if (!this.util.returnBoolByPath(match, 'home.teamName')){
        home = '';
      }else{
        home = match.home.teamName.toLowerCase();
      }
      if(team){
        team = team.toLowerCase();
      }
      
      let pass = false;
      if (div && round && team) {
        if (div == match.divisionConcat && round == match.round && 
          (away.indexOf(team) > -1 || home.indexOf(team) >-1 )) {
          pass = true;
        }
      } else if (div && round){
        if (div == match.divisionConcat && round == match.round) {
          pass = true;
        }
      } else if (div && team) {
        if (div == match.divisionConcat && (away.indexOf(team) > -1 || home.indexOf(team) > -1 )) {
          pass = true;
        }
      } else if (round && team) {
        if (round == match.round && (away.indexOf(team) > -1 || home.indexOf(team) > -1 )) {
          pass = true;
        }
      }else if(div) {
        if (div == match.divisionConcat) {
          pass = true;
        }
      } else if (round) {
        if (round == match.round) {
          pass = true;
        }
      }else if(team){
        if (away.indexOf(team) > -1 || home.indexOf(team) > -1 ){
          pass = true;
        }
      } else {
        pass = true
      }
      return pass;
    }
    );

    this.length = this.filterMatches.length;
    this.displayArray = this.filterMatches.slice(0, this.pageSize > this.length ? this.length : this.pageSize);
    this.paginator.firstPage();
  }

  displayTime(ms) {
    let d = new Date(parseInt(ms));
    let day = d.getDate();
    let year = d.getFullYear();
    let month = d.getMonth();
    month = month + 1;
    let hours = d.getHours();
    let suffix = "AM";
    if (hours > 12) {
      hours = hours - 12;
      suffix = "PM";
    }

    let min = d.getMinutes();
    let minStr;
    if (min == 0) {
      minStr = '00';
    } else {
      minStr = min.toString();
    }
    let dateTime = month + '/' + day + '/' + year + ' @ ' + hours + ':' + minStr + " " + suffix;
    return dateTime;
  }

}
