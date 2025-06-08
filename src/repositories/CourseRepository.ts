import { Course } from "../models/CourseModel";

export class CourseRepository {
    private static instance: CourseRepository;
    private course: Course[] = [];

    private constructor() { 
        this.course = [
            new Course("ADS"),
            new Course("Pedagogia"),
            new Course("Administração")
        ];
     }

    public static getInstance(): CourseRepository {
        if (!this.instance) {
            this.instance = new CourseRepository();
        }
        return this.instance;
    }

    list(){
        return this.course;
    }
}