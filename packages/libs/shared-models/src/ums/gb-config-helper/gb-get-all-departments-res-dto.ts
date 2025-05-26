export class GetAllDepartmentsResDto {
    code: string
    name: string
    DepartmentId: number
    constructor(
        code: string,
        name: string,
        DepartmentId: number,
    ) {
        this.code = code;
        this.name = name;
        this.DepartmentId = DepartmentId;
    }
}