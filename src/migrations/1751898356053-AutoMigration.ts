import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751898356053 implements MigrationInterface {
    name = 'AutoMigration1751898356053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP COLUMN \`returnQuantity\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP COLUMN \`returnReason\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP COLUMN \`refundedAmount\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD \`refundedAmount\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD \`returnReason\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD \`returnQuantity\` int NULL
        `);
    }

}
