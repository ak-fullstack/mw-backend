import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751781515982 implements MigrationInterface {
    name = 'AutoMigration1751781515982'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'APPROVED',
                    'REJECTED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED'
        `);
    }

}
