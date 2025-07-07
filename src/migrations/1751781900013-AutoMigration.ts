import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751781900013 implements MigrationInterface {
    name = 'AutoMigration1751781900013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'WAITING_APPROVAL',
                    'SPLIT',
                    'REFUNDED',
                    'REPLACED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'WAITING_APPROVAL',
                    'REFUNDED',
                    'REPLACED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED'
        `);
    }

}
