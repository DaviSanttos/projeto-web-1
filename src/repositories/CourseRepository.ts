import { Course } from "../models/CourseModel";
import { UserCategory } from "../models/UserCategory";
import { User } from "../models/UserModel";

export class CourseRepository {
    private static instance: CourseRepository;
    private userList: Course[] = [];

    private constructor() { }

    public static getInstance(): CourseRepository {
        if (!this.instance) {
            this.instance = new CourseRepository();
        }
        return this.instance;
    }

    create(course: Course) {
        this.userList.push(course);
    }

    list(){
        return this.userList;
    }
    // ... outros mé todos
}