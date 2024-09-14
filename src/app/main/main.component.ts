import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProjectComponent } from './project/project.component';
import { Project } from './project/project.model';
import { ProjectService } from './project/project.service';
import { SubmitModalComponent } from './submit-modal/submit-modal.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.template.html',
  styleUrls: ['./main.style.scss']
})

export class MainComponent implements OnInit {
  public projectData: Project[];
  public selectedProjects: Project[];
  private projectSubscription: Subscription;
  @ViewChildren(ProjectComponent) projectComponents:QueryList<ProjectComponent>;

  constructor (public dialog: MatDialog, private projectService:ProjectService ) {}

  ngOnInit() {
    this.projectData = this.projectService.getProjectData();
    this.projectSubscription = this.projectService
      .getProjectsUpdateListener()
      .subscribe((projectsUpdate: { projects: Project[] }) => {
        this.selectedProjects = projectsUpdate.projects;
      });;
  }

  onReviewClicked() {
    const timesheetsValid = this.projectComponents.toArray().some(project => project.areTimesheetsValid());
    if (!timesheetsValid) {
      // Todo add snackbar message and indicate form issue
      return;
    }

    const dialogRef = this.dialog.open(SubmitModalComponent, {
      data: { projects: this.selectedProjects },
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
