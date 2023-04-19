import { Elements } from './elements';
import { Tags } from './tags';

export interface TestResult {
    comments: string[];
    elements: Elements[];
    name: string;
    tags: Tags[];
}