import { MigrationInterface, QueryRunner } from "typeorm";

export class ReturnEntityChanges1751359167412 implements MigrationInterface {
    name = 'ReturnEntityChanges1751359167412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\` CHANGE \`retrunStatus\` \`returnStatus\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED') NOT NULL DEFAULT 'PENDING'
        `);
        await queryRunner.query(`
            ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`retrunStatus\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'
        `);
    }

}
