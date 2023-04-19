import { Project } from "./project";
import { Component } from "./component";
import { Folder } from "./folder";
import { Links } from "./links";
import { Owner } from "./owner";
import { Priority } from "./priority";
import { Status } from "./status";
import { TestScript } from "./testscript";

export interface Values {
    id: number;
    key: string;
    name: string;
    project: Project;
    createdOn: string;
    objective: string;
    precondition: string;
    estimatedTime: number;
    labels: string[];
    component: Component;
    priority: Priority;
    status: Status;
    folder: Folder;
    owner: Owner;
    testScript: TestScript;
    customFields: object;
    links: Links;
}