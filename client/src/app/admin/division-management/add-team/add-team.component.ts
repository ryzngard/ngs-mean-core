import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { indexOf } from 'lodash';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {


  constructor(private admin: AdminService) { }

  undivisionTeams
  divisions
  ngOnInit() {
    this.admin.getTeamsNotDivisioned().subscribe(res => {
      this.undivisionTeams = res;
    }, (err) => {
      console.log(err)
    })
    this.admin.getDivisionList().subscribe(res => {
      this.divisions = res;
    }, (err) => {
      console.log(err);
    })
  }

  selectedTeams: any = [];
  teamSelected(team) {
    //if team is in the array, remove and deactivate it
    console.log('clicked')
    let index = indexOf(this.selectedTeams, team)
    if (index > -1) {
      this.selectedTeams.splice(index, 1);
    } else {
      this.selectedTeams.push(team);
    }
    console.log(this.selectedTeams);
  }

  selectedDiv
  divSelected(div) {
    this.selectedDiv = div;
  }

  isSelected(team): boolean {
    let index = indexOf(this.selectedTeams, team)
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }


  isDivSelected(div): boolean {
    if (this.selectedDiv == div) {
      return true;
    } else {
      return false;
    }
  }

  divisionTeams() {
    this.admin.divisionTeam(this.selectedTeams, this.selectedDiv.divisionConcat).subscribe(
      res => {
        console.log('added to division');
        this.ngOnInit();
      }, (err) => {
        console.log(err)
      }
    );
  }

}