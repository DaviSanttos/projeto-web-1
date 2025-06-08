import { Course } from "../models/CourseModel";

export class CourseRepository {
    private static instance: CourseRepository;
    private course: Course[] = [];

    private constructor() { 
        this.course = [
            new Course("ADS", 1),
            new Course("Pedagogia", 2),
            new Course("Administração", 3)
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

    getIdByName(name: string): number | undefined {
        return this.course.find(course => course.nome === name)?.id;
    }
}