import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754033793157 implements MigrationInterface {
    name = 'AutoMigration1754033793157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`order_settings\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`settings\` json NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`order_settings\`
        `);
    }

}
