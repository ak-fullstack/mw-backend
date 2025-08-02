import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754047443385 implements MigrationInterface {
    name = 'AutoMigration1754047443385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`originalSubtotal\` \`originalSubtotal\` decimal(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`discountAmount\` \`discountAmount\` decimal(10, 2) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`discountAmount\` \`discountAmount\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`originalSubtotal\` \`originalSubtotal\` decimal(10, 2) NULL
        `);
    }

}
