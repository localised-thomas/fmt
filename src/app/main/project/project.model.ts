import { Timesheet } from "src/app/main/timesheet/timesheet.model";

export interface Project {
 id: number,
 name: string,
 code: number,
 colour?: string,
 timesheets?: Array<Timesheet>,
}
