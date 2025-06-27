import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751016559916 implements MigrationInterface {
    name = 'AutoMigration1751016559916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` DROP COLUMN \`used\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\` DROP COLUMN \`reserved\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\`
            ADD \`reserved\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\`
            ADD \`used\` int NOT NULL DEFAULT '0'
        `);
    }

}
