import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754643408863 implements MigrationInterface {
    name = 'AutoMigration1754643408863';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\`
            ADD \`initialDamagedQuantity\` int NOT NULL DEFAULT 0
        `);

        // Ensure all existing records have 0 (usually redundant if default is added)
        await queryRunner.query(`
            UPDATE \`stocks\` SET \`initialDamagedQuantity\` = 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` DROP COLUMN \`initialDamagedQuantity\`
        `);
    }
}
