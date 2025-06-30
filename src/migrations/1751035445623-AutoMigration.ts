import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1751035445623 implements MigrationInterface {
    name = 'AutoMigration1751035445623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`deliveryDate\` \`deliveredAt\` datetime NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`deliveredAt\` \`deliveryDate\` datetime NULL
        `);
    }

}
