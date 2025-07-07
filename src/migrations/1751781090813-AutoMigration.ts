import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751781090813 implements MigrationInterface {
    name = 'AutoMigration1751781090813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`returnStatus\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'WAITING_APPROVAL',
                    'PROCESSED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`returnStatus\` enum (
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
