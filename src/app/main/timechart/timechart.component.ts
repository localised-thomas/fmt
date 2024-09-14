import { Component } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Project } from '../project/project.model';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-timechart',
  templateUrl: './timechart.template.html',
  styleUrls: ['./timechart.style.scss']
})
export class TimechartComponent {
  weekdayData: any[];
  projectColours: { name:string, value:string }[] = [];
  overFourtyHours: boolean = false;
  totalHours: number = 0;
  private projectSubscription: Subscription;
  private projects: Project[];

  constructor(public projectService: ProjectService) {}

  ngOnInit() {
    this.weekdayData = [
      {
        "name": "Monday",
        "series": []
      },
      {
        "name": "Tuesday",
        "series": []
      },
      {
        "name": "Wednesday",
        "series": []
      },
      {
        "name": "Thursday",
        "series": []
      },
      {
        "name": "Friday",
        "series": []
      }
    ];

    this.projectSubscription = this.projectService
      .getProjectsUpdateListener()
      .subscribe((projectsUpdate: { projects: Project[] }) => {
        this.projects = JSON.parse(JSON.stringify(projectsUpdate.projects));
        this.updateChartColours();
        this.updateChartData();
      });;
  }

  updateChartColours() {
    const chargeColours = [];
    this.projects.forEach(project => {
      chargeColours.push({ name: project.name, value: project.colour });
    });
    this.projectColours = chargeColours;
  }

  updateChartData() {
    let updatedHours = 0;
    const dayIndexes = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
    }
    const updatedChartData = [
      {
        "name": "Monday",
        "series": []
      },
      {
        "name": "Tuesday",
        "series": []
      },
      {
        "name": "Wednesday",
        "series": []
      },
      {
        "name": "Thursday",
        "series": []
      },
      {
        "name": "Friday",
        "series": []
      }
    ];
    this.projects.forEach(project => {
      const projectName = project.name;

      project.timesheets
        .forEach(timesheet => {
          const day = moment(timesheet.startDate).format('dddd');
          updatedChartData[dayIndexes[day.toLowerCase()]].series.push({
            name: projectName,
            value: timesheet.timeSpent,
            tooltip: timesheet.memo
          });
          updatedHours += timesheet.timeSpent;
        });
    });
    this.weekdayData = updatedChartData;
    this.totalHours = updatedHours;
  }


  // TODO update chart options with model
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Hours';
  animations: boolean = true;
  colorScheme = {
    domain: ['#003c88']
  };
  customColors: any;
  custColors = [
      {
        name: "Apple",
        value: '#521250'
      },
      {
        name: "Blizzard",
        value: '#1ae6db'
      },
      {
        name: "Tesco",
        value: '#8d6c2f'
      },
  ];

}
