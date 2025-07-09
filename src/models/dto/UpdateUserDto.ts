import { userActive } from "../entity/UserEntity";
import { UserCategoryName } from "../entity/UserCategoryEntity";
import { CourseName } from "../entity/CourseEntity";

export class UpdateUserDto {
  nome?: string;
  categoria?: UserCategoryName;
  curso?: CourseName;
  ativo?: userActive;
}

