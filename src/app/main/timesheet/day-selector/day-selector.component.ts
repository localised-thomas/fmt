import { Component, OnInit  } from '@angular/core';
import * as moment from 'moment';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-day-selector',
  templateUrl: './day-selector.template.html',
  styleUrls: ['./day-selector.style.scss']
})

export class DaySelectorComponent implements OnInit {
  // TODO unused component. Remove?
  form: FormGroup;
  firstDayOfWeek: moment.Moment;
  selectedDate: string;
  weekdays: { name:string, index:number }[];

  ngOnInit() {
    this.weekdays = [
      { name: 'Monday', index: -6 },
      { name: 'Tuesday', index: -5 },
      { name: 'Wednesday', index: -4 },
      { name: 'Thursday', index: -3 },
      { name: 'Friday', index: -2 },
    ]

    moment.weekdays()
    const firstDayOfWeek = moment().isoWeekday(-6);
    this.selectedDate = firstDayOfWeek.format('dddd');
  }
}
