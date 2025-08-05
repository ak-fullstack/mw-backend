import { MigrationInterface, QueryRunner } from "typeorm";

export class ShiprocketModule1754329115437 implements MigrationInterface {
    name = 'ShiprocketModule1754329115437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`shiprocket_status_logs\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`shipmentId\` int NOT NULL,
                \`status\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`shiprocket_shipments\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`orderId\` int NOT NULL,
                \`type\` enum ('forward', 'return') NOT NULL,
                \`shiprocketOrderId\` varchar(255) NULL,
                \`awbCode\` varchar(255) NULL,
                \`pickupId\` varchar(255) NULL,
                \`courierCompany\` varchar(255) NULL,
                \`shipmentStatus\` varchar(255) NULL,
                \`trackingUrl\` text NULL,
                \`shippingLabelUrl\` text NULL,
                \`manifestUrl\` text NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\`
            ADD CONSTRAINT \`FK_3b11c48f7d63542203a37fb9aa6\` FOREIGN KEY (\`shipmentId\`) REFERENCES \`shiprocket_shipments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\`
            ADD CONSTRAINT \`FK_31b1dc9ff6fd3fcdcf255216938\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` DROP FOREIGN KEY \`FK_31b1dc9ff6fd3fcdcf255216938\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\` DROP FOREIGN KEY \`FK_3b11c48f7d63542203a37fb9aa6\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shiprocket_shipments\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shiprocket_status_logs\`
        `);
    }

}
