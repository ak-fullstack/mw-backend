import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754417155947 implements MigrationInterface {
    name = 'AutoMigration1754417155947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`billingName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`shippingName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`billingFirstName\` varchar(50) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`billingLastName\` varchar(50) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`shippingFirstName\` varchar(50) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`shippingLastName\` varchar(50) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`shippingLastName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`shippingFirstName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`billingLastName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP COLUMN \`billingFirstName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`shippingName\` varchar(50) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD \`billingName\` varchar(50) NULL
        `);
    }

}
