import { MigrationInterface, QueryRunner } from "typeorm";

export class Creation1753886236913 implements MigrationInterface {
    name = 'Creation1753886236913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`role_permission\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`permission\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`roleId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`role\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`roleName\` varchar(255) NOT NULL,
                \`permissionGroup\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_a6142dcc61f5f3fb2d6899fa26\` (\`roleName\`),
                UNIQUE INDEX \`IDX_2955c0fb3e650a2ca9ecb49420\` (\`permissionGroup\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`firstName\` varchar(50) NOT NULL,
                \`lastName\` varchar(50) NOT NULL,
                \`fullName\` varchar(101) AS (CONCAT(firstName, ' ', lastName)) STORED NOT NULL,
                \`email\` varchar(100) NOT NULL,
                \`phone\` varchar(10) NOT NULL,
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`roleId\` int NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`status\` enum ('ACTIVE', 'INACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
                \`isDeleted\` tinyint NOT NULL DEFAULT 0,
                \`streetAddress\` varchar(255) NOT NULL,
                \`city\` varchar(100) NOT NULL,
                \`state\` enum (
                    'Andhra Pradesh',
                    'Arunachal Pradesh',
                    'Assam',
                    'Bihar',
                    'Chhattisgarh',
                    'Goa',
                    'Gujarat',
                    'Haryana',
                    'Himachal Pradesh',
                    'Jharkhand',
                    'Karnataka',
                    'Kerala',
                    'Madhya Pradesh',
                    'Maharashtra',
                    'Manipur',
                    'Meghalaya',
                    'Mizoram',
                    'Nagaland',
                    'Odisha',
                    'Punjab',
                    'Rajasthan',
                    'Sikkim',
                    'Tamil Nadu',
                    'Telangana',
                    'Tripura',
                    'Uttarakhand',
                    'Uttar Pradesh',
                    'West Bengal',
                    'Andaman and Nicobar Islands',
                    'Chandigarh',
                    'Dadra and Nagar Haveli',
                    'Daman and Diu',
                    'Delhi',
                    'Lakshadweep',
                    'Puducherry'
                ) NOT NULL DEFAULT 'Tamil Nadu',
                \`pincode\` varchar(10) NOT NULL,
                \`profileImageUrl\` varchar(255) NOT NULL,
                \`fullAddress\` varchar(512) NULL,
                \`passwordHash\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            INSERT INTO \`mw_local\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, ?, ?, ?, ?)
        `, ["mw_local","users","GENERATED_COLUMN","fullName","CONCAT(firstName, ' ', lastName)"]);
        await queryRunner.query(`
            CREATE TABLE \`eod_closure\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`date\` date NOT NULL,
                \`orderCount\` int NOT NULL DEFAULT '0',
                \`totalOrderValue\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`returnCount\` int NOT NULL DEFAULT '0',
                \`totalReturnValue\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`totalDiscount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`cgst\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`sgst\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`igst\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`netRevenue\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`refundAmount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`paymentMethods\` json NULL,
                \`notes\` text NULL,
                \`closureTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_9cb17ff48c560792048a1b5e67\` (\`date\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`customer_addresses\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`streetAddress\` text NULL,
                \`fullAddress\` varchar(255) AS (
                    CONCAT(
                        streetAddress,
                        ', ',
                        city,
                        ', ',
                        state,
                        ', ',
                        country,
                        ', ',
                        pincode
                    )
                ) STORED NULL,
                \`city\` varchar(50) NULL,
                \`state\` enum (
                    'Andhra Pradesh',
                    'Arunachal Pradesh',
                    'Assam',
                    'Bihar',
                    'Chhattisgarh',
                    'Goa',
                    'Gujarat',
                    'Haryana',
                    'Himachal Pradesh',
                    'Jharkhand',
                    'Karnataka',
                    'Kerala',
                    'Madhya Pradesh',
                    'Maharashtra',
                    'Manipur',
                    'Meghalaya',
                    'Mizoram',
                    'Nagaland',
                    'Odisha',
                    'Punjab',
                    'Rajasthan',
                    'Sikkim',
                    'Tamil Nadu',
                    'Telangana',
                    'Tripura',
                    'Uttarakhand',
                    'Uttar Pradesh',
                    'West Bengal',
                    'Andaman and Nicobar Islands',
                    'Chandigarh',
                    'Dadra and Nagar Haveli',
                    'Daman and Diu',
                    'Delhi',
                    'Lakshadweep',
                    'Puducherry'
                ) NULL,
                \`pincode\` varchar(6) NULL,
                \`country\` varchar(6) NOT NULL DEFAULT 'India',
                \`customerId\` int NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            INSERT INTO \`mw_local\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, ?, ?, ?, ?)
        `, ["mw_local","customer_addresses","GENERATED_COLUMN","fullAddress","CONCAT(streetAddress, ', ', city, ', ', state, ', ', country, ', ', pincode)"]);
        await queryRunner.query(`
            CREATE TABLE \`suppliers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`email\` varchar(100) NULL,
                \`phone\` varchar(15) NULL,
                \`gstNumber\` varchar(20) NULL,
                \`address\` text NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_5b5720d9645cee7396595a16c9\` (\`name\`),
                UNIQUE INDEX \`IDX_3867bf1e1851574fb6b13cb3c4\` (\`gstNumber\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`stock_purchases\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`billRefNo\` varchar(255) NOT NULL,
                \`subTotal\` decimal(10, 2) NOT NULL,
                \`totalTax\` decimal(10, 2) NOT NULL,
                \`totalAmount\` decimal(10, 2) NOT NULL,
                \`invoicePdfUrl\` varchar(255) NULL,
                \`purchaseDate\` timestamp NOT NULL,
                \`gstType\` enum ('IGST', 'CGST_SGST') NOT NULL,
                \`verified\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`supplierId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`subcategories\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`categoryId\` int NOT NULL,
                UNIQUE INDEX \`IDX_45aa12007713728e241d091775\` (\`name\`, \`categoryId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`categories\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`size_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(50) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_77906353982bdcf08578085c24\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`sizes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`label\` varchar(20) NOT NULL,
                \`description\` varchar(255) NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`type_id\` int NOT NULL,
                UNIQUE INDEX \`IDX_98bf12f26194bd989618b300e5\` (\`label\`, \`type_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`hsnCode\` varchar(20) NULL,
                \`has_sizes\` tinyint NOT NULL DEFAULT 0,
                \`has_colors\` tinyint NOT NULL DEFAULT 0,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`categoryId\` int NULL,
                \`subCategoryId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`colors\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(50) NOT NULL,
                \`hexCode\` varchar(7) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`IDX_cf12321fa0b7b9539e89c7dfeb\` (\`name\`),
                UNIQUE INDEX \`IDX_c66dadabcc582e65f5c9ee0671\` (\`hexCode\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_images\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`imageUrl\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`variantId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_variants\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`sku\` varchar(255) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`productId\` int NULL,
                \`colorId\` int NULL,
                \`sizeId\` int NULL,
                UNIQUE INDEX \`IDX_46f236f21640f9da218a063a86\` (\`sku\`),
                UNIQUE INDEX \`IDX_819d317d3010bd3a71c5dd1a2c\` (\`productId\`, \`colorId\`, \`sizeId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`stock_movements\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quantity\` int NOT NULL,
                \`from\` enum (
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
                ) NULL,
                \`to\` enum (
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
                ) NOT NULL,
                \`movedBy\` varchar(255) NULL,
                \`remarks\` varchar(255) NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`stockId\` int NOT NULL,
                \`orderId\` int NULL,
                \`orderItemId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`stocks\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quantity\` int NOT NULL,
                \`sp\` decimal(10, 2) NOT NULL,
                \`mrp\` decimal(10, 2) NOT NULL,
                \`cgst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`sgst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`igst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`discount_percent\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`applyDiscount\` tinyint NOT NULL DEFAULT 1,
                \`ctc\` decimal(10, 2) NOT NULL,
                \`subTotal\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`totalAmount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`totalTax\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`cgstAmount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`sgstAmount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`igstAmount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`approved\` tinyint NOT NULL DEFAULT 0,
                \`onSale\` tinyint NOT NULL DEFAULT 0,
                \`expiryDate\` date NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`productVariantId\` int NULL,
                \`purchaseId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`order_items\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quantity\` int NOT NULL,
                \`sp\` decimal(10, 2) NOT NULL,
                \`mrp\` decimal(10, 2) NOT NULL,
                \`cgst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`sgst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`igst\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`discount\` decimal(5, 2) NOT NULL DEFAULT '0.00',
                \`ctc\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`gstType\` enum ('IGST', 'CGST_SGST') NOT NULL,
                \`subTotal\` decimal(10, 2) NOT NULL,
                \`originalSubtotal\` decimal(10, 2) NULL,
                \`discountAmount\` decimal(10, 2) NULL,
                \`itemCgstAmount\` decimal(10, 2) NOT NULL,
                \`itemSgstAmount\` decimal(10, 2) NOT NULL,
                \`itemIgstAmount\` decimal(10, 2) NOT NULL,
                \`deliveryCgstAmount\` decimal(10, 2) NOT NULL,
                \`deliverySgstAmount\` decimal(10, 2) NOT NULL,
                \`deliveryIgstAmount\` decimal(10, 2) NOT NULL,
                \`itemTaxAmount\` decimal(10, 2) NOT NULL,
                \`deliveryTaxAmount\` decimal(10, 2) NOT NULL,
                \`deliveryShare\` decimal(10, 2) NOT NULL,
                \`deliveryCharge\` decimal(10, 2) NOT NULL,
                \`totalTaxAmount\` decimal(10, 2) NOT NULL,
                \`totalAmount\` decimal(10, 2) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`orderId\` int NULL,
                \`productVariantId\` int NULL,
                \`stockId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`refund\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`razorpayRefundId\` varchar(255) NOT NULL,
                \`amount\` decimal NOT NULL,
                \`reason\` varchar(255) NULL,
                \`status\` varchar(255) NOT NULL DEFAULT 'initiated',
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`paymentId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`payment\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`razorpayPaymentId\` varchar(255) NOT NULL,
                \`amount\` decimal NOT NULL,
                \`status\` varchar(50) NOT NULL DEFAULT 'created',
                \`paymentMethod\` varchar(20) NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`paidAt\` timestamp NULL,
                \`orderId\` int NULL,
                UNIQUE INDEX \`IDX_8d4bbf8245e3730d1bc28c75d6\` (\`razorpayPaymentId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`return_items\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quantity\` int NOT NULL,
                \`reason\` text NULL,
                \`status\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_ACCEPTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'WAITING_APPROVAL',
                    'SPLIT',
                    'REFUNDED',
                    'REPLACED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED',
                \`itemCondition\` enum ('GOOD', 'DAMAGED', 'REPAIRABLE') NULL,
                \`resolutionMethod\` enum ('WALLET_REFUND', 'SOURCE_REFUND', 'REPLACEMENT') NULL,
                \`resolutionDate\` datetime(6) NULL,
                \`subTotal\` decimal(10, 2) NOT NULL,
                \`originalSubtotal\` decimal(10, 2) NULL,
                \`discountAmount\` decimal(10, 2) NULL,
                \`itemCgstAmount\` decimal(10, 2) NOT NULL,
                \`itemSgstAmount\` decimal(10, 2) NOT NULL,
                \`itemIgstAmount\` decimal(10, 2) NOT NULL,
                \`deliveryCgstAmount\` decimal(10, 2) NOT NULL,
                \`deliverySgstAmount\` decimal(10, 2) NOT NULL,
                \`deliveryIgstAmount\` decimal(10, 2) NOT NULL,
                \`totalItemTax\` decimal(10, 2) NOT NULL,
                \`totalDeliveryTax\` decimal(10, 2) NOT NULL,
                \`deliveryShare\` decimal(10, 2) NOT NULL,
                \`deliveryCharge\` decimal(10, 2) NOT NULL,
                \`totalTaxAmount\` decimal(10, 2) NOT NULL,
                \`totalAmount\` decimal(10, 2) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`returnId\` int NULL,
                \`orderItemId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`return_image\` (
                \`id\` varchar(36) NOT NULL,
                \`imageUrl\` varchar(255) NOT NULL,
                \`returnId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`returns\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`reason\` text NULL,
                \`returnStatus\` enum (
                    'RETURN_REQUESTED',
                    'RETURN_ACCEPTED',
                    'RETURN_IN_TRANSIT',
                    'RETURN_RECEIVED',
                    'WAITING_APPROVAL',
                    'PROCESSED',
                    'COMPLETED'
                ) NOT NULL DEFAULT 'RETURN_REQUESTED',
                \`returnType\` enum ('REFUND', 'REPLACEMENT') NOT NULL DEFAULT 'REPLACEMENT',
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`processedDate\` timestamp NULL,
                \`orderId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`wallet\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`balance\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`customerId\` int NULL,
                UNIQUE INDEX \`REL_fe7ef5ca5ba7189b3258b813d5\` (\`customerId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`wallet_transaction\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`amount\` decimal(10, 2) NOT NULL,
                \`reason\` enum (
                    'ORDER_PAYMENT',
                    'ORDER_REFUND',
                    'RETURN_REFUND',
                    'ADMIN_ADJUSTMENT',
                    'CASHBACK',
                    'WALLET_TOPUP'
                ) NOT NULL,
                \`description\` varchar(255) NULL,
                \`transactionType\` enum ('CREDIT', 'DEBIT') NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`walletId\` int NULL,
                \`orderId\` int NULL,
                \`returnRequestId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`orders\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`orderStatus\` enum (
                    'PENDING',
                    'CONFIRMED',
                    'QC_CHECK',
                    'WAITING_PICKUP',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                    'RETURNED',
                    'PARTIALLY_RETURNED'
                ) NOT NULL DEFAULT 'PENDING',
                \`paymentStatus\` enum (
                    'pending',
                    'paid',
                    'failed',
                    'refunded',
                    'partial_refunded'
                ) NOT NULL DEFAULT 'pending',
                \`razorpayOrderId\` varchar(255) NULL,
                \`successfulPaymentId\` varchar(50) NULL,
                \`paymentMethod\` varchar(30) NULL,
                \`totalDiscount\` decimal(10, 2) NOT NULL,
                \`totalAmount\` decimal(10, 2) NOT NULL,
                \`paidAmount\` decimal(10, 2) NULL,
                \`subTotal\` decimal(10, 2) NOT NULL,
                \`deliveryCharge\` decimal(10, 2) NOT NULL,
                \`totalTax\` decimal(10, 2) NOT NULL,
                \`originalSubtotal\` decimal(10, 2) NOT NULL,
                \`totalDeliveryTax\` decimal(10, 2) NOT NULL,
                \`totalItemTax\` decimal(10, 2) NOT NULL,
                \`billingName\` varchar(50) NULL,
                \`billingPhoneNumber\` varchar(10) NULL,
                \`billingEmailId\` varchar(100) NOT NULL,
                \`billingStreetAddress\` text NULL,
                \`billingCity\` varchar(50) NULL,
                \`billingState\` enum (
                    'Andhra Pradesh',
                    'Arunachal Pradesh',
                    'Assam',
                    'Bihar',
                    'Chhattisgarh',
                    'Goa',
                    'Gujarat',
                    'Haryana',
                    'Himachal Pradesh',
                    'Jharkhand',
                    'Karnataka',
                    'Kerala',
                    'Madhya Pradesh',
                    'Maharashtra',
                    'Manipur',
                    'Meghalaya',
                    'Mizoram',
                    'Nagaland',
                    'Odisha',
                    'Punjab',
                    'Rajasthan',
                    'Sikkim',
                    'Tamil Nadu',
                    'Telangana',
                    'Tripura',
                    'Uttarakhand',
                    'Uttar Pradesh',
                    'West Bengal',
                    'Andaman and Nicobar Islands',
                    'Chandigarh',
                    'Dadra and Nagar Haveli',
                    'Daman and Diu',
                    'Delhi',
                    'Lakshadweep',
                    'Puducherry'
                ) NULL,
                \`billingPincode\` varchar(6) NULL,
                \`billingCountry\` varchar(100) NULL DEFAULT 'India',
                \`shippingName\` varchar(50) NULL,
                \`shippingPhoneNumber\` varchar(10) NULL,
                \`shippingEmailId\` varchar(100) NOT NULL,
                \`shippingStreetAddress\` text NULL,
                \`shippingCity\` varchar(50) NULL,
                \`shippingState\` enum (
                    'Andhra Pradesh',
                    'Arunachal Pradesh',
                    'Assam',
                    'Bihar',
                    'Chhattisgarh',
                    'Goa',
                    'Gujarat',
                    'Haryana',
                    'Himachal Pradesh',
                    'Jharkhand',
                    'Karnataka',
                    'Kerala',
                    'Madhya Pradesh',
                    'Maharashtra',
                    'Manipur',
                    'Meghalaya',
                    'Mizoram',
                    'Nagaland',
                    'Odisha',
                    'Punjab',
                    'Rajasthan',
                    'Sikkim',
                    'Tamil Nadu',
                    'Telangana',
                    'Tripura',
                    'Uttarakhand',
                    'Uttar Pradesh',
                    'West Bengal',
                    'Andaman and Nicobar Islands',
                    'Chandigarh',
                    'Dadra and Nagar Haveli',
                    'Daman and Diu',
                    'Delhi',
                    'Lakshadweep',
                    'Puducherry'
                ) NULL,
                \`shippingPincode\` varchar(6) NULL,
                \`shippingCountry\` varchar(100) NULL DEFAULT 'India',
                \`packageLength\` decimal(10, 2) NULL,
                \`packageBreadth\` decimal(10, 2) NULL,
                \`packageHeight\` decimal(10, 2) NULL,
                \`packageWeight\` decimal(10, 2) NULL,
                \`paidAt\` timestamp NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`replacementForOrderId\` int NULL,
                \`isReplacement\` tinyint NOT NULL DEFAULT 0,
                \`hasReturn\` tinyint NOT NULL DEFAULT 0,
                \`deliveredAt\` datetime NULL,
                \`paymentSource\` enum ('wallet', 'razorpay', 'wallet+razorpay', 'none') NOT NULL DEFAULT 'razorpay',
                \`usedWallet\` tinyint NOT NULL DEFAULT 0,
                \`walletAmountUsed\` decimal(10, 2) NOT NULL,
                \`razorpayAmountPaid\` decimal(10, 2) NULL,
                \`isZeroPayment\` tinyint NOT NULL DEFAULT 0,
                \`customerId\` int NOT NULL,
                UNIQUE INDEX \`IDX_61736e2399fff253cc785ce56b\` (\`razorpayOrderId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`customers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`firstName\` varchar(50) NULL,
                \`lastName\` varchar(50) NULL,
                \`fullName\` varchar(101) AS (CONCAT(firstName, ' ', lastName)) STORED NULL,
                \`phoneNumber\` varchar(10) NULL,
                \`emailId\` varchar(100) NOT NULL,
                \`status\` varchar(20) NOT NULL DEFAULT 'ACTIVE',
                \`role\` enum ('ADMIN', 'CUSTOMER', 'FAM_MEMBER', 'GUEST') NOT NULL DEFAULT 'FAM_MEMBER',
                \`profileImageUrl\` varchar(255) NULL,
                \`billingAddressId\` int NULL,
                \`shippingAddressId\` int NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`passwordHash\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_3e418bff40d3abac5642cd5d39\` (\`phoneNumber\`),
                UNIQUE INDEX \`IDX_54673f6c9b248a71997a0f78a8\` (\`emailId\`),
                UNIQUE INDEX \`REL_6e264631e81226cb4ba88b84d6\` (\`billingAddressId\`),
                UNIQUE INDEX \`REL_75937747c05abe0d927830ee0b\` (\`shippingAddressId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            INSERT INTO \`mw_local\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, ?, ?, ?, ?)
        `, ["mw_local","customers","GENERATED_COLUMN","fullName","CONCAT(firstName, ' ', lastName)"]);
        await queryRunner.query(`
            CREATE TABLE \`otps\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`expiresAt\` datetime NOT NULL,
                \`used\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_colors\` (
                \`product_id\` int NOT NULL,
                \`color_id\` int NOT NULL,
                INDEX \`IDX_90213070102b149edd87ab1207\` (\`product_id\`),
                INDEX \`IDX_ab5fd8f7c7e066c3126f6ac280\` (\`color_id\`),
                PRIMARY KEY (\`product_id\`, \`color_id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_sizes\` (
                \`product_id\` int NOT NULL,
                \`size_id\` int NOT NULL,
                INDEX \`IDX_b6d94a689dd115cdf01589b961\` (\`product_id\`),
                INDEX \`IDX_b77c486737027396bcfdc0897b\` (\`size_id\`),
                PRIMARY KEY (\`product_id\`, \`size_id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`role_permission\`
            ADD CONSTRAINT \`FK_e3130a39c1e4a740d044e685730\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`customer_addresses\`
            ADD CONSTRAINT \`FK_7bd088b1c8d3506953240ebf030\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_purchases\`
            ADD CONSTRAINT \`FK_910ea3106ca7568ba6f4564cef6\` FOREIGN KEY (\`supplierId\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`subcategories\`
            ADD CONSTRAINT \`FK_d1fe096726c3c5b8a500950e448\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`sizes\`
            ADD CONSTRAINT \`FK_a736919846680ebe30cc6dc07be\` FOREIGN KEY (\`type_id\`) REFERENCES \`size_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_ad42985fb27aa9016b16ee740ec\` FOREIGN KEY (\`subCategoryId\`) REFERENCES \`subcategories\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_images\`
            ADD CONSTRAINT \`FK_7f1a676cadb42cc18fe9a367608\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\`
            ADD CONSTRAINT \`FK_f515690c571a03400a9876600b5\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\`
            ADD CONSTRAINT \`FK_a25f8063109b6344800b860348d\` FOREIGN KEY (\`colorId\`) REFERENCES \`colors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\`
            ADD CONSTRAINT \`FK_0e271925ab3814da891704b02bd\` FOREIGN KEY (\`sizeId\`) REFERENCES \`sizes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\`
            ADD CONSTRAINT \`FK_7d46969a34089aeea345f1f328f\` FOREIGN KEY (\`stockId\`) REFERENCES \`stocks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\`
            ADD CONSTRAINT \`FK_db9fcb4c901068853d81ef374ee\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\`
            ADD CONSTRAINT \`FK_0936d88e386f0b95e43e534bf3c\` FOREIGN KEY (\`orderItemId\`) REFERENCES \`order_items\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\`
            ADD CONSTRAINT \`FK_deb4cf093cace504804bb2bf5fb\` FOREIGN KEY (\`productVariantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\`
            ADD CONSTRAINT \`FK_13df959ff931f465b9b6bd7e3d4\` FOREIGN KEY (\`purchaseId\`) REFERENCES \`stock_purchases\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD CONSTRAINT \`FK_f1d359a55923bb45b057fbdab0d\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD CONSTRAINT \`FK_9cf6578d9f8c7f43cc96c7af6d8\` FOREIGN KEY (\`productVariantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\`
            ADD CONSTRAINT \`FK_6846e17a08ea9780f792e591ea3\` FOREIGN KEY (\`stockId\`) REFERENCES \`stocks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`refund\`
            ADD CONSTRAINT \`FK_1c6932a756108788a361e7d4404\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\`
            ADD CONSTRAINT \`FK_2d7a02e4a660050ca70edd7df66\` FOREIGN KEY (\`returnId\`) REFERENCES \`returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\`
            ADD CONSTRAINT \`FK_cffa12df74a94bc3ccc347379e9\` FOREIGN KEY (\`orderItemId\`) REFERENCES \`order_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\`
            ADD CONSTRAINT \`FK_794963ad14bf1f7674ff49a9c4a\` FOREIGN KEY (\`returnId\`) REFERENCES \`returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`returns\`
            ADD CONSTRAINT \`FK_b3851bc6d0e2a7ddc7412806a0f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\`
            ADD CONSTRAINT \`FK_fe7ef5ca5ba7189b3258b813d52\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD CONSTRAINT \`FK_07de5136ba8e92bb97d45b9a7af\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD CONSTRAINT \`FK_622c0d7b82f8a468e11128c827f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\`
            ADD CONSTRAINT \`FK_4db4e567b4538ee7286afc3b281\` FOREIGN KEY (\`returnRequestId\`) REFERENCES \`returns\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD CONSTRAINT \`FK_e5de51ca888d8b1f5ac25799dd1\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD CONSTRAINT \`FK_dec05f09b9f19b426348c0b70fc\` FOREIGN KEY (\`replacementForOrderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_6e264631e81226cb4ba88b84d6b\` FOREIGN KEY (\`billingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\`
            ADD CONSTRAINT \`FK_75937747c05abe0d927830ee0bc\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_colors\`
            ADD CONSTRAINT \`FK_90213070102b149edd87ab1207e\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_colors\`
            ADD CONSTRAINT \`FK_ab5fd8f7c7e066c3126f6ac280b\` FOREIGN KEY (\`color_id\`) REFERENCES \`colors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_sizes\`
            ADD CONSTRAINT \`FK_b6d94a689dd115cdf01589b9615\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_sizes\`
            ADD CONSTRAINT \`FK_b77c486737027396bcfdc0897bf\` FOREIGN KEY (\`size_id\`) REFERENCES \`sizes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product_sizes\` DROP FOREIGN KEY \`FK_b77c486737027396bcfdc0897bf\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_sizes\` DROP FOREIGN KEY \`FK_b6d94a689dd115cdf01589b9615\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_colors\` DROP FOREIGN KEY \`FK_ab5fd8f7c7e066c3126f6ac280b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_colors\` DROP FOREIGN KEY \`FK_90213070102b149edd87ab1207e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_75937747c05abe0d927830ee0bc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_6e264631e81226cb4ba88b84d6b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_dec05f09b9f19b426348c0b70fc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_e5de51ca888d8b1f5ac25799dd1\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP FOREIGN KEY \`FK_4db4e567b4538ee7286afc3b281\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP FOREIGN KEY \`FK_622c0d7b82f8a468e11128c827f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet_transaction\` DROP FOREIGN KEY \`FK_07de5136ba8e92bb97d45b9a7af\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wallet\` DROP FOREIGN KEY \`FK_fe7ef5ca5ba7189b3258b813d52\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`returns\` DROP FOREIGN KEY \`FK_b3851bc6d0e2a7ddc7412806a0f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\` DROP FOREIGN KEY \`FK_794963ad14bf1f7674ff49a9c4a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` DROP FOREIGN KEY \`FK_cffa12df74a94bc3ccc347379e9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_items\` DROP FOREIGN KEY \`FK_2d7a02e4a660050ca70edd7df66\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`refund\` DROP FOREIGN KEY \`FK_1c6932a756108788a361e7d4404\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_6846e17a08ea9780f792e591ea3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_9cf6578d9f8c7f43cc96c7af6d8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_f1d359a55923bb45b057fbdab0d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\` DROP FOREIGN KEY \`FK_13df959ff931f465b9b6bd7e3d4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stocks\` DROP FOREIGN KEY \`FK_deb4cf093cace504804bb2bf5fb\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` DROP FOREIGN KEY \`FK_0936d88e386f0b95e43e534bf3c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` DROP FOREIGN KEY \`FK_db9fcb4c901068853d81ef374ee\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_movements\` DROP FOREIGN KEY \`FK_7d46969a34089aeea345f1f328f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_0e271925ab3814da891704b02bd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_a25f8063109b6344800b860348d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_f515690c571a03400a9876600b5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_7f1a676cadb42cc18fe9a367608\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ad42985fb27aa9016b16ee740ec\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`sizes\` DROP FOREIGN KEY \`FK_a736919846680ebe30cc6dc07be\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`subcategories\` DROP FOREIGN KEY \`FK_d1fe096726c3c5b8a500950e448\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`stock_purchases\` DROP FOREIGN KEY \`FK_910ea3106ca7568ba6f4564cef6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`customer_addresses\` DROP FOREIGN KEY \`FK_7bd088b1c8d3506953240ebf030\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3130a39c1e4a740d044e685730\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b77c486737027396bcfdc0897b\` ON \`product_sizes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b6d94a689dd115cdf01589b961\` ON \`product_sizes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_sizes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_ab5fd8f7c7e066c3126f6ac280\` ON \`product_colors\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_90213070102b149edd87ab1207\` ON \`product_colors\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_colors\`
        `);
        await queryRunner.query(`
            DROP TABLE \`otps\`
        `);
        await queryRunner.query(`
            DELETE FROM \`mw_local\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
                AND \`table\` = ?
        `, ["GENERATED_COLUMN","fullName","mw_local","customers"]);
        await queryRunner.query(`
            DROP INDEX \`REL_75937747c05abe0d927830ee0b\` ON \`customers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_6e264631e81226cb4ba88b84d6\` ON \`customers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_54673f6c9b248a71997a0f78a8\` ON \`customers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_3e418bff40d3abac5642cd5d39\` ON \`customers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`customers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_61736e2399fff253cc785ce56b\` ON \`orders\`
        `);
        await queryRunner.query(`
            DROP TABLE \`orders\`
        `);
        await queryRunner.query(`
            DROP TABLE \`wallet_transaction\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_fe7ef5ca5ba7189b3258b813d5\` ON \`wallet\`
        `);
        await queryRunner.query(`
            DROP TABLE \`wallet\`
        `);
        await queryRunner.query(`
            DROP TABLE \`returns\`
        `);
        await queryRunner.query(`
            DROP TABLE \`return_image\`
        `);
        await queryRunner.query(`
            DROP TABLE \`return_items\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_8d4bbf8245e3730d1bc28c75d6\` ON \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`refund\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order_items\`
        `);
        await queryRunner.query(`
            DROP TABLE \`stocks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`stock_movements\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_819d317d3010bd3a71c5dd1a2c\` ON \`product_variants\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_46f236f21640f9da218a063a86\` ON \`product_variants\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_variants\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_images\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_c66dadabcc582e65f5c9ee0671\` ON \`colors\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_cf12321fa0b7b9539e89c7dfeb\` ON \`colors\`
        `);
        await queryRunner.query(`
            DROP TABLE \`colors\`
        `);
        await queryRunner.query(`
            DROP TABLE \`products\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_98bf12f26194bd989618b300e5\` ON \`sizes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`sizes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_77906353982bdcf08578085c24\` ON \`size_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`size_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`categories\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_45aa12007713728e241d091775\` ON \`subcategories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`subcategories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`stock_purchases\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_3867bf1e1851574fb6b13cb3c4\` ON \`suppliers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_5b5720d9645cee7396595a16c9\` ON \`suppliers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`suppliers\`
        `);
        await queryRunner.query(`
            DELETE FROM \`mw_local\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
                AND \`table\` = ?
        `, ["GENERATED_COLUMN","fullAddress","mw_local","customer_addresses"]);
        await queryRunner.query(`
            DROP TABLE \`customer_addresses\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9cb17ff48c560792048a1b5e67\` ON \`eod_closure\`
        `);
        await queryRunner.query(`
            DROP TABLE \`eod_closure\`
        `);
        await queryRunner.query(`
            DELETE FROM \`mw_local\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
                AND \`table\` = ?
        `, ["GENERATED_COLUMN","fullName","mw_local","users"]);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_2955c0fb3e650a2ca9ecb49420\` ON \`role\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_a6142dcc61f5f3fb2d6899fa26\` ON \`role\`
        `);
        await queryRunner.query(`
            DROP TABLE \`role\`
        `);
        await queryRunner.query(`
            DROP TABLE \`role_permission\`
        `);
    }

}
