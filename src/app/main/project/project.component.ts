import { AfterContentInit, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { TimesheetFormComponent } from 'src/app/main/timesheet/timesheet-form/timesheet-form.component';
import { Timesheet } from 'src/app/main/timesheet/timesheet.model';
import * as moment from 'moment';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { TaskService } from '../timesheet/task.service';
import { Task } from '../timesheet/task.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.template.html',
  styleUrls: ['./project.style.scss']
})

export class ProjectComponent implements AfterContentInit {
  @Input() project: Project;
  @ViewChildren(TimesheetFormComponent) timesheetComponents:QueryList<TimesheetFormComponent>;
  public taskData: Task[];

  constructor(private projectService:ProjectService, private taskService: TaskService) {}

  ngAfterContentInit() {
    this.taskData = this.taskService.getTaskData();
    this.addNewTimesheet();
  }

  onFormCopy($event) {
    // TODO bug copy does not update chart
    const newTimesheet:Timesheet = {
      task: $event.formData.task,
      startDate: $event.formData.startDate,
      memo: $event.formData.memo,
      timeSpent: $event.formData.timeSpent,
      isCopy: true
    }
    this.project.timesheets.push(newTimesheet);
    this.sortTimesheets();
  }

  onFormDelete($event) {
    const timesheetToRemove = $event.formData;
    // TODO Update timesheet entries to have server/db id
    // const timesheetToRemove = $event.formData.id;
    // For now, remove by comparison
    // TODO Does not work for copied timesheets, but not fixing as will not be issue after id implemented
    this.project.timesheets = this.project.timesheets.filter(timesheet => JSON.stringify(timesheet) !== JSON.stringify(timesheetToRemove));
    this.projectService.notifyChange();
  }

  addNewTimesheet() {
    let startDate = null;

    if (this.project.timesheets?.length) {
      const lastestTimesheetDay = this.project.timesheets[this.project.timesheets.length - 1].startDate.day();
      // Add new timesheet at next day, unless Friday
      const latestTimesheetDayIndex = lastestTimesheetDay == 5 ? -2 : lastestTimesheetDay - 6;
      startDate = moment().isoWeekday(latestTimesheetDayIndex);
    }

    const newTimesheet:Timesheet = {
      // ENTRYID: '',
      task: {name: '', code: 0},
      startDate: startDate,
      memo: '',
      timeSpent: null,
    }
    this.project.timesheets.push(newTimesheet);
    this.sortTimesheets();
  }

  sortTimesheets() {
    this.project.timesheets.sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        if (a.startDate > b.startDate) return 1;
        return 0;
    });
  }

  areTimesheetsValid() {
    return this.timesheetComponents.toArray().some(timesheet => timesheet.form.valid);
  }
}
