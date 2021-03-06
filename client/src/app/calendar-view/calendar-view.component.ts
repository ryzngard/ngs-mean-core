import { Component,ChangeDetectionStrategy,ViewChild,TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays,addDays,endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ScheduleService } from '../services/schedule.service';
import { EventModalComponent } from './event-modal/event-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EventsService } from '../services/events.service';

const colors: any = {
  heroic: {  //navy
    primary: '#001f3f',
    name: 'Heroic Division',
    sortOder:1
  },
  a: { //red
    primary: '#FF4136',
    name: 'Division A',
    sortOder: 2
  },
  'b-east':{ //teal
    primary:'#39CCCC',
    name: 'Division B East',
    sortOder: 3
  },
  'b-west': { //aqua
    primary: '#7FDBFF',
    name: 'Division B West',
    sortOder: 4
  },
  'c-east': { //fuchsia
    primary: '#F012BE',
    name: 'Division C East',
    sortOder: 5
  },
  'c-west':{ //PURPLE
    primary: '#B10DC9',
    name: 'Division C West',
    sortOder: 6
  },
  'd-east': { //green
    primary: '#2ECC40',
    name: 'Division D East',
    sortOder: 7
  },
  'd-west': { //lime
    primary: '#01FF70',
    name: 'Division D West',
    sortOder: 8
  },
  'event':{ //orange
    primary:'#FF851B',
    name: 'NGS Event',
    sortOder: 9
  }
};


@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {

  sortOrder = (a,b)=>{
    return a.value.sortOrder > b.value.sortOrder ? 1 : 0;
  }

  key = colors;

  constructor(private matches: ScheduleService, public dialog: MatDialog, private router:Router, private eventService:EventsService) { }

  _matches = [];
  ngOnInit(){
    this.matches.getAllMatchesWithStartTime().subscribe(
      res=>{
        let matches = res;
        this._matches = res;
        matches.forEach(match => {
          let event: CalendarEvent = {
            'start': new Date(parseInt(match.scheduledTime.startTime)),
            'end': new Date(parseInt(match.scheduledTime.endTime)),
            'title': match.home.teamName + ' vs ' + match.away.teamName,
            'meta':{ id: match.matchId, 'type':'match'}
          };

          if(match.casterName!=null||match.casterName!=undefined){
            event['title']+=' Casted! '
          }

          event['color']=colors[match.divisionConcat];
          
          this.events.push(event);
        });

        this.eventService.getAll().subscribe(
          reply=>{

            reply.forEach(rep=>{
              let event: CalendarEvent = {
                'start': new Date(parseInt(rep.eventDate)),
                'title': rep.eventName,
                'meta': { id: rep.uuid, 'type': 'event' }
              };

              event['color'] = colors.event;
              this.events.push(event);

            })
            this.refresh.next();
          },
          err=>{
            console.log(err);
          }
        )

        
      },
      err=>{
        console.log(err);
      }
    )
    //todo: pull in matches
  }

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  openDialog(match): void {

    const dialogRef = this.dialog.open(EventModalComponent, {
      width:'700px',
      data: match
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {

    this.eventService.setLocalEvent(event.meta);
    this.router.navigate(['event/']);
    

  }


}
