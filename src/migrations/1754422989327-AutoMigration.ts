import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754422989327 implements MigrationInterface {
    name = 'AutoMigration1754422989327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\` DROP FOREIGN KEY \`FK_3b11c48f7d63542203a37fb9aa6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\` CHANGE \`shipmentId\` \`shipmentId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` DROP FOREIGN KEY \`FK_31b1dc9ff6fd3fcdcf255216938\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` CHANGE \`orderId\` \`orderId\` int NULL
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
            ALTER TABLE \`shiprocket_shipments\` CHANGE \`orderId\` \`orderId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\`
            ADD CONSTRAINT \`FK_31b1dc9ff6fd3fcdcf255216938\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\` CHANGE \`shipmentId\` \`shipmentId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_status_logs\`
            ADD CONSTRAINT \`FK_3b11c48f7d63542203a37fb9aa6\` FOREIGN KEY (\`shipmentId\`) REFERENCES \`shiprocket_shipments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
