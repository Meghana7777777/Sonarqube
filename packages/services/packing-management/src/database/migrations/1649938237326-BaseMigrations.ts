import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1649938237326 implements MigrationInterface {
    name = 'BaseMigrations1649938237326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const no_of_failed_logins = ``
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
