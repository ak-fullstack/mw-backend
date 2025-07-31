import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1753946987887 implements MigrationInterface {
    name = 'AutoMigration1753946987887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\`
            ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\`
            ADD \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP COLUMN \`updatedAt\`
        `);
    }

}
