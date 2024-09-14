import { Component, Output, EventEmitter, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import {  FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSelect } from '@angular/material/select';
import * as moment from 'moment';
import { ProjectService } from '../../project/project.service';
import { Timesheet } from '../timesheet.model';
import { Task } from '../task.model';

@Component({
  selector: "app-timesheet-form",
  templateUrl: "./timesheet-form.template.html",
  styleUrls: ["./timesheet-form.style.scss"]
})
export class TimesheetFormComponent implements OnInit {
  form: FormGroup;
  weekdays: moment.Moment[];
  selectedDay: moment.Moment;

  @Input() timesheet: Timesheet;
  @Input() taskData: Task[];
  @Output() onFormCopy = new EventEmitter<{}>();
  @Output() onFormDelete = new EventEmitter<{}>();
  @ViewChild('codeSelector') codeSelectElement:MatSelect;

  constructor(private projectService:ProjectService) {}

  ngOnInit() {
    this.form = new FormGroup({
      task: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      memo: new FormControl(null, { validators: [Validators.required] }),
      timeSpent: new FormControl(null, { validators: [Validators.required] }), // TODO invalidate 0 hours
    });

    this.weekdays = [
      moment().isoWeekday(-6),
      moment().isoWeekday(-5),
      moment().isoWeekday(-4),
      moment().isoWeekday(-3),
      moment().isoWeekday(-2),
    ];

    this.setInitialFormValues();
    this.onChanges();
  }

  ngAfterViewInit() {
    if (this.timesheet.isCopy) return; // Don't open for copied timesheets
    this.codeSelectElement.focus();
    this.codeSelectElement.open();
  }

  setInitialFormValues() {
    // notify changes for initial form update
    for (const [key, value] of Object.entries(this.timesheet)) {
      if (key === 'isCopy') continue; // property to control ui, skip
      if (key !== 'startDate') {
        this.form.controls[key].setValue(value);
      } else {
        if (value) {
          const day = this.weekdays.find(day => day.format('DD/MM/YYYY') == value.format('DD/MM/YYYY'));
          this.form.controls.startDate.setValue(day);
        } else {
          // init day at Monday
          this.form.controls.startDate.setValue(this.weekdays[0]);
        }
      }
    }
  }

  onChanges() {
    this.form.valueChanges.subscribe(value => {
      Object.assign(this.timesheet, value);
      // if valid, notify change
      if (this.form.valid) {
        this.projectService.notifyChange();
      }
    });
  }

  onCopy() {
    if (this.form.valid) this.onFormCopy.emit({ formData: this.form.value });
  }

  onDelete() {
    this.onFormDelete.emit({ formData: this.form.value });
  }

  onSubmit() {

  }
}
