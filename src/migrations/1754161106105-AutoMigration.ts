import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754161106105 implements MigrationInterface {
    name = 'AutoMigration1754161106105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`order_items\` CHANGE \`originalSubtotal\` \`originalSubtotal\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` CHANGE \`discountAmount\` \`discountAmount\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`resolutionMethod\` \`resolutionMethod\` enum ('WALLET_REFUND', 'REPLACEMENT') NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`resolutionMethod\` \`resolutionMethod\` enum ('WALLET_REFUND', 'SOURCE_REFUND', 'REPLACEMENT') NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` CHANGE \`discountAmount\` \`discountAmount\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` CHANGE \`originalSubtotal\` \`originalSubtotal\` decimal(10, 2) NULL
        `);
    }

}
