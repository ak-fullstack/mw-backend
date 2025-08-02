import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754122622011 implements MigrationInterface {
    name = 'AutoMigration1754122622011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` DROP FOREIGN KEY \`FK_2d7a02e4a660050ca70edd7df66\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`returnId\` \`returnId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\`
            ADD CONSTRAINT \`FK_2d7a02e4a660050ca70edd7df66\` FOREIGN KEY (\`returnId\`) REFERENCES \`returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_items\` DROP FOREIGN KEY \`FK_2d7a02e4a660050ca70edd7df66\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` CHANGE \`returnId\` \`returnId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\`
            ADD CONSTRAINT \`FK_2d7a02e4a660050ca70edd7df66\` FOREIGN KEY (\`returnId\`) REFERENCES \`returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
