import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751782771963 implements MigrationInterface {
    name = 'AutoMigration1751782771963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\`
            ADD \`itemCondition\` enum ('GOOD', 'DAMAGED', 'REPAIRABLE') NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` DROP COLUMN \`itemCondition\`
        `);
    }

}
