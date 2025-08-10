import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754734942688 implements MigrationInterface {
    name = 'AutoMigration1754734942688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\` DROP COLUMN \`reason\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\`
            ADD \`reason\` text NULL
        `);
    }

}
