import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754429847044 implements MigrationInterface {
    name = 'AutoMigration1754429847044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\`
            ADD \`shipmentId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` CHANGE \`from\` \`from\` enum (
                    'supplier',
                    'available',
                    'reserved',
                    'qc_check',
                    'waiting_awb',
                    'waiting_pickup',
                    'shipped',
                    'in_transit_to_customer',
                    'delivered',
                    'return_accepted',
                    'in_transit_to_seller',
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
                    'waiting_awb',
                    'waiting_pickup',
                    'shipped',
                    'in_transit_to_customer',
                    'delivered',
                    'return_accepted',
                    'in_transit_to_seller',
                    'returned',
                    'damaged'
                ) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`orderStatus\` \`orderStatus\` enum (
                    'PENDING',
                    'CONFIRMED',
                    'QC_CHECK',
                    'WAITING_AWB',
                    'WAITING_PICKUP',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                    'RETURNED',
                    'PARTIALLY_RETURNED'
                ) NOT NULL DEFAULT 'PENDING'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`orderStatus\` \`orderStatus\` enum (
                    'PENDING',
                    'CONFIRMED',
                    'QC_CHECK',
                    'WAITING_PICKUP',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                    'RETURNED',
                    'PARTIALLY_RETURNED'
                ) NOT NULL DEFAULT 'PENDING'
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
                    'delivered',
                    'return_accepted',
                    'in_transit_to_seller',
                    'returned',
                    'damaged'
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
                    'in_transit_to_customer',
                    'delivered',
                    'return_accepted',
                    'in_transit_to_seller',
                    'returned',
                    'damaged'
                ) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` DROP COLUMN \`shipmentId\`
        `);
    }

}
