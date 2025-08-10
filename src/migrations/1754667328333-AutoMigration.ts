import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754667328333 implements MigrationInterface {
    name = 'AutoMigration1754667328333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`role_permission\` DROP COLUMN \`permission\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`role_permission\`
            ADD \`permission\` enum (
                    'MASTER_PERMISSION',
                    'CREATE_ROLE',
                    'READ_ROLE',
                    'DELETE_ROLE',
                    'READ_DASHBOARD',
                    'READ_PERMISSION',
                    'CREATE_USER',
                    'READ_USER',
                    'UPDATE_USER',
                    'READ_CUSTOMER',
                    'READ_ORDER',
                    'CREATE_PRODUCT',
                    'READ_PRODUCT',
                    'UPDATE_PRODUCT_IMAGE',
                    'UPDATE_PRODUCT',
                    'DELETE_PRODUCT',
                    'READ_REPORTS',
                    'CREATE_STOCK',
                    'READ_STOCK',
                    'UPDATE_STOCK_APPROVAL',
                    'READ_RETURN',
                    'READ_SETTINGS'
                ) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`role_permission\` DROP COLUMN \`permission\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`role_permission\`
            ADD \`permission\` varchar(255) NOT NULL
        `);
    }

}
