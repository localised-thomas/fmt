import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Project } from "./project.model";
import { ColourService } from "src/app/colour.service";

@Injectable({ providedIn: "root" })
export class ProjectService {

  private onProjectsUpdated = new Subject<{ projects: Project[] }>();
  private selectedProjects: Project[] = [];
  private projects: Project[] = [];

  constructor(private colourService: ColourService) {
    this.onInit();
  }

  onInit() {
    this.projects = this.fetchProjectData();
  }

  fetchProjectData(): Project[] {
    // TODO replace dummy data
    const projectData: Project[] = [
        { id: 1, name: 'Tesco', code: 1234 },
        { id: 2, name: 'Boeing', code: 2345 },
        { id: 3, name: 'Blizzard', code: 3456 },
        { id: 4, name: 'Apple', code: 4567 },
        { id: 4, name: 'Dell', code: 5678 },
        { id: 4, name: 'Amazon', code: 6789 },
    ];

    projectData.map((element, index) => {
      element.colour = this.colourService.getColourAtIndex(index);
      element.timesheets = [];
      return element;
    });

    return projectData;
  }

  getProjectData() {
    return this.projects;
  }

  async addProject(newProject) {
    this.selectedProjects.push(newProject);
    this.notifyChange();
  }

  removeProject(projectToRemove) {
    const matchingBasketItemIndex = this.getProjectIndex(projectToRemove);
    this.selectedProjects[matchingBasketItemIndex].timesheets = [];
    this.selectedProjects.splice(matchingBasketItemIndex, 1);
    this.notifyChange();
  }

  clearAll() {
    this.selectedProjects.forEach((project) => {
      project.timesheets = [];
    })
    this.selectedProjects = [];
    this.notifyChange();
  }

  notifyChange() {
    // this.sortTimesheets();
    this.onProjectsUpdated.next({
      projects: this.selectedProjects,
    });
  }

  getProjectsUpdateListener() {
    return this.onProjectsUpdated.asObservable();
  }

  getProjects() {
    return this.selectedProjects;
  }

  getProjectIndex(projectToFind) {
    return this.selectedProjects.findIndex(project => project.id == projectToFind.value.id);
  }

  sortTimesheets() {
    this.selectedProjects.forEach((project) => {
      project.timesheets.sort((a, b) => {
          if (a.startDate < b.startDate) return -1;
          if (a.startDate > b.startDate) return 1;
          return 0;
      });
    });
  }

}
