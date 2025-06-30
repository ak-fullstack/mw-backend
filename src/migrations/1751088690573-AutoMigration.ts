import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751088690573 implements MigrationInterface {
    name = 'AutoMigration1751088690573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Replace old enum values in data
        await queryRunner.query(`
            UPDATE \`stock_movements\`
            SET \`from\` = 'in_transit_to_customer'
            WHERE \`from\` = 'in_transit'
        `);
        await queryRunner.query(`
            UPDATE \`stock_movements\`
            SET \`to\` = 'in_transit_to_customer'
            WHERE \`to\` = 'in_transit'
        `);

        // Step 2: Alter ENUM definitions
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` CHANGE \`from\` \`from\` enum (
                    'supplier',
                    'available',
                    'reserved',
                    'qc_check',
                    'waiting_pickup',
                    'shipped',
                    'in_transit_to_customer',
                    'in_transit_to_seller',
                    'delivered',
                    'returned',
                    'damaged'
                ) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` CHANGE \`to\` \`to\` enum (
                    'supplier',
                    'available',
                    'reserved',
                    'qc_check',
                    'waiting_pickup',
                    'shipped',
                    'in_transit_to_customer',
                    'in_transit_to_seller',
                    'delivered',
                    'returned',
                    'damaged'
                ) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Revert new values back to old one
        await queryRunner.query(`
            UPDATE \`stock_movements\`
            SET \`from\` = 'in_transit'
            WHERE \`from\` = 'in_transit_to_customer'
        `);
        await queryRunner.query(`
            UPDATE \`stock_movements\`
            SET \`to\` = 'in_transit'
            WHERE \`to\` = 'in_transit_to_customer'
        `);

        // Step 2: Restore old ENUM definitions
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` CHANGE \`to\` \`to\` enum (
                    'supplier',
                    'available',
                    'reserved',
                    'qc_check',
                    'waiting_pickup',
                    'shipped',
                    'in_transit',
                    'delivered',
                    'returned',
                    'damaged',
                    'sold'
                ) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` CHANGE \`from\` \`from\` enum (
                    'supplier',
                    'available',
                    'reserved',
                    'qc_check',
                    'waiting_pickup',
                    'shipped',
                    'in_transit',
                    'delivered',
                    'returned',
                    'damaged',
                    'sold'
                ) NULL
        `);
    }
}
