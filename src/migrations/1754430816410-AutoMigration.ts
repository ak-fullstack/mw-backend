import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754430816410 implements MigrationInterface {
    name = 'AutoMigration1754430816410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` CHANGE \`shipmentId\` \`shipRocketShipmentId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` DROP COLUMN \`shipRocketShipmentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\`
            ADD \`shipRocketShipmentId\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` DROP COLUMN \`shipRocketShipmentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\`
            ADD \`shipRocketShipmentId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`shiprocket_shipments\` CHANGE \`shipRocketShipmentId\` \`shipmentId\` varchar(255) NULL
        `);
    }

}
