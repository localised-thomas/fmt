import { AfterContentInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Project } from '../project/project.model';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.template.html',
  styleUrls: ['./project-selector.style.scss']
})

export class ProjectSelectorComponent implements AfterContentInit {
    @Input() projectData: Project[];
    @Output() onSelectedProjectsUpdated = new EventEmitter<Project[]>();
    @ViewChild('projectSelector') projectSelectElement:MatSelect;

    constructor(public projectService: ProjectService) {}

    selectedProjects: Project[];

    ngAfterContentInit() {
      this.projectSelectElement.focus();
      this.projectSelectElement.open();
    }

    onAdd($event) {
      this.projectService.addProject($event);
    }

    onRemove($event) {
      this.projectService.removeProject($event);
    }

    onClear() {
      this.projectService.clearAll();
    }
}
