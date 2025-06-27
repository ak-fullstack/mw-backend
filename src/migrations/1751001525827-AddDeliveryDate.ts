import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryDate1751001525827 implements MigrationInterface {
    name = 'AddDeliveryDate1751001525827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`deliveryDate\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`deliveryDate\``);
    }

}
