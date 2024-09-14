import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../project/project.model';
import { Timesheet } from '../timesheet/timesheet.model';
import { Task } from '../timesheet/task.model';
import * as moment from 'moment';

@Component({
  selector: 'app-submit-modal',
  templateUrl: './submit-modal.template.html',
  styleUrls: ['./submit-modal.style.scss']
})

export class SubmitModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {projects: Project[]}) { }

  public summaryViewTypes: typeof SummaryViewType = SummaryViewType;
  public selectedSummaryView: SummaryViewType = this.summaryViewTypes.DAY;
  public weekdays: string[] = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday' ];
  public displayCodes: boolean = false;
  public weeklyTimeSpent: number = 0;
  public summary: { [key: string]: DailySummary } = {
    monday: { timeSpent: 0, summaries: [] },
    tuesday: { timeSpent: 0, summaries: [] },
    wednesday: { timeSpent: 0, summaries: [] },
    thursday: { timeSpent: 0, summaries: [] },
    friday: { timeSpent: 0, summaries: [] }
  };

  ngOnInit() {
    this.createSummary();
  }

  onCancelClicked() {
    console.log('cancel clicked');
  }

  onSubmitClicked() {
    console.log('submit clicked');
  }

  createSummary() {
    // TODO refactor when using real data
    this.data.projects.forEach((project: Project) => {
      project.timesheets.forEach((timesheet: Timesheet) => {
        const timesheetDay = timesheet.startDate.day();
        const timesheetDayName = this.weekdays[timesheetDay - 1];

        let summaryProject = this.summary[timesheetDayName].summaries.find(summaryProject => summaryProject.code === project.code);
        if (!summaryProject) {
          // Project not yet added to summary, add it
          summaryProject = { name: project.name, code: project.code, timeSpent: 0, colour: project.colour, activities: [] };
          this.summary[timesheetDayName].summaries.push(summaryProject);
        }

        const existingActivityIndex = summaryProject.activities.findIndex(activity => activity.code === timesheet.task.code);
        let activity = null;
        if (existingActivityIndex !== -1) {
          // Same activity, update time spent on activity
          activity = summaryProject.activities[existingActivityIndex];
          activity.timeSpent += timesheet.timeSpent;
        } else {
          // New activity, add to summary
          activity = { memo: timesheet.memo, name: timesheet.task.name, code: timesheet.task.code, timeSpent: timesheet.timeSpent };
          summaryProject.activities.push(activity);
        }

        // Update timespent in total for whole day, individual project and week
        summaryProject.timeSpent += timesheet.timeSpent;
        this.summary[timesheetDayName].timeSpent += timesheet.timeSpent;
        this.weeklyTimeSpent += timesheet.timeSpent;
        // Add humanized time to display
        activity.displayTimeSpent = moment.duration(activity.timeSpent, 'hours').humanize();
        summaryProject.displayTimeSpent = moment.duration(summaryProject.timeSpent, 'hours').humanize();
        this.summary[timesheetDayName].displayTimeSpent = moment.duration(this.summary[timesheetDayName].timeSpent, 'hours').humanize();
      });
    });
  }

  onViewSelectionChange($event) {
    this.selectedSummaryView = $event.value;
  }
}

export enum SummaryViewType {
  PROJECT = 'project',
  DAY = 'day'
}

export interface DailySummary {
  summaries: ProjectSummary[];
  timeSpent: number;
  displayTimeSpent?: string;
}
export interface ProjectSummary {
  code: number,
  name: string,
  timeSpent: number,
  displayTimeSpent?: string,
  colour: string,
  activities: TaskSummary[]
}

export interface TaskSummary extends Task {
  timeSpent: number,
  displayTimeSpent?: string,
  memo: string
}
