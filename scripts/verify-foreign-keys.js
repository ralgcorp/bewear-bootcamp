const { Pool } = require("pg");
require("dotenv").config();

async function verifyForeignKeys() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Verificando foreign keys...\n");

    // Query para listar todas as foreign keys
    const result = await pool.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name,
        rc.delete_rule,
        rc.update_rule
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    if (result.rows.length === 0) {
      console.log("❌ Nenhuma foreign key encontrada!");
      return;
    }

    console.log(`✅ Encontradas ${result.rows.length} foreign keys:\n`);

    let currentTable = "";
    result.rows.forEach((row, index) => {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name;
        console.log(`\n📋 Tabela: ${row.table_name}`);
      }

      console.log(
        `  • ${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`,
      );
      console.log(`    Constraint: ${row.constraint_name}`);
      console.log(`    Delete: ${row.delete_rule}, Update: ${row.update_rule}`);
    });

    // Verificar se todas as foreign keys esperadas estão presentes
    const expectedFKs = [
      "account_user_id_user_id_fk",
      "admin_account_table_user_id_admin_user_table_id_fk",
      "admin_session_table_user_id_admin_user_table_id_fk",
      "cart_item_cart_id_cart_id_fk",
      "cart_item_product_variant_id_product_variant_id_fk",
      "cart_user_id_user_id_fk",
      "cart_shipping_address_id_shipping_address_id_fk",
      "order_item_order_id_order_id_fk",
      "order_item_product_variant_id_product_variant_id_fk",
      "order_user_id_user_id_fk",
      "order_shipping_address_id_shipping_address_id_fk",
      "product_category_id_category_id_fk",
      "product_variant_product_id_product_id_fk",
      "session_user_id_user_id_fk",
      "shipping_address_user_id_user_id_fk",
    ];

    const foundFKs = result.rows.map((row) => row.constraint_name);
    const missingFKs = expectedFKs.filter((fk) => !foundFKs.includes(fk));

    if (missingFKs.length === 0) {
      console.log("\n🎉 Todas as foreign keys esperadas estão presentes!");
    } else {
      console.log("\n⚠️  Foreign keys ausentes:");
      missingFKs.forEach((fk) => console.log(`  • ${fk}`));
    }
  } catch (error) {
    console.error("❌ Erro ao verificar foreign keys:", error.message);
  } finally {
    await pool.end();
  }
}

verifyForeignKeys();
