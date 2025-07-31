import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1753987135174 implements MigrationInterface {
    name = 'AutoMigration1753987135174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` CHANGE \`applyDiscount\` \`applyDiscount\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` CHANGE \`applyDiscount\` \`applyDiscount\` tinyint NOT NULL DEFAULT '1'
        `);
    }

}
