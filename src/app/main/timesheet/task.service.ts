import { Injectable } from "@angular/core";
import { Task } from "./task.model";

@Injectable({ providedIn: "root" })
export class TaskService {

  private tasks: Task[] = [];

  constructor() {
    this.onInit();
  }

  onInit() {
    this.tasks = this.fetchTaskData();
  }

  fetchTaskData(): Task[] {
    // TODO replace dummy data with request
    const taskData: Task[] = [
        { name: 'Development', code: 1234 },
        { name: 'Project Management', code: 2345 },
        { name: 'Testing', code: 3456 },
        { name: 'Marketing', code: 4567 },
        { name: 'Admin', code: 5678 },
    ];

    return taskData;
  }

  getTaskData() {
    return this.tasks;
  }

}
