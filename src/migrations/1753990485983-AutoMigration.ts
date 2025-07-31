import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1753990485983 implements MigrationInterface {
    name = 'AutoMigration1753990485983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_6e264631e81226cb4ba88b84d6b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_75937747c05abe0d927830ee0bc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_6e264631e81226cb4ba88b84d6b\` FOREIGN KEY (\`billingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_75937747c05abe0d927830ee0bc\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_75937747c05abe0d927830ee0bc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_6e264631e81226cb4ba88b84d6b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_75937747c05abe0d927830ee0bc\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_6e264631e81226cb4ba88b84d6b\` FOREIGN KEY (\`billingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
