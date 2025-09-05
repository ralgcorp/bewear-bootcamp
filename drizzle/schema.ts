import { pgTable, foreignKey, uuid, text, timestamp, unique, integer, boolean, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const adminVariantRules = pgEnum("admin_variant_rules", ['atendimento', 'cadastro', 'suporte', 'financeiro', 'marketing', 'gerencial', 'superadmin'])
export const orderStatus = pgEnum("order_status", ['pending', 'paid', 'canceled'])
export const productVariantStatus = pgEnum("product_variant_status", ['selling', 'out_of_stock', 'discontinued'])


export const cart = pgTable("cart", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	shippingAddressId: uuid("shipping_address_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "cart_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shippingAddressId],
			foreignColumns: [shippingAddress.id],
			name: "cart_shipping_address_id_shipping_address_id_fk"
		}).onDelete("set null"),
]);

export const adminUser = pgTable("admin_user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("admin_user_email_unique").on(table.email),
]);

export const productVariant = pgTable("product_variant", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	color: text(),
	priceInCents: integer("price_in_cents").notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sku: text().notNull(),
	qty: integer().default(1).notNull(),
	minQty: integer("min_qty").default(1).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	weigth: numeric({ precision: 10, scale:  3 }),
	volumeHeight: numeric("volume_height", { precision: 10, scale:  2 }),
	volumeWidth: numeric("volume_width", { precision: 10, scale:  2 }),
	volumeLength: numeric("volume_length", { precision: 10, scale:  2 }),
	costPriceInCents: integer("cost_price_in_cents"),
	newFromDate: timestamp("new_from_date", { mode: 'string' }),
	newToDate: timestamp("new_to_date", { mode: 'string' }),
	specialPriceInCents: integer("special_price_in_cents"),
	specialPriceStartsAt: timestamp("special_price_starts_at", { mode: 'string' }),
	specialPriceEndsAt: timestamp("special_price_ends_at", { mode: 'string' }),
	minCartQty: integer("min_cart_qty").default(1).notNull(),
	maxCartQty: integer("max_cart_qty").default(100).notNull(),
	metaTitle: text("meta_title"),
	metaDescription: text("meta_description"),
	metaKeywords: text("meta_keywords"),
	countryOfOrigin: text("country_of_origin"),
	manufacturer: text(),
	manufacturingDeadline: text("manufacturing_deadline").default('Pronto para Envio'),
	warranty: text(),
	itemsIncluded: text("items_included"),
	eanGtinUpc: text("ean_gtin_upc"),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "product_variant_product_id_product_id_fk"
		}).onDelete("cascade"),
	unique("product_variant_slug_unique").on(table.slug),
	unique("product_variant_sku_unique").on(table.sku),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const category = pgTable("category", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("category_slug_unique").on(table.slug),
]);

export const order = pgTable("order", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	shippingAddressId: uuid("shipping_address_id").notNull(),
	recipientName: text().notNull(),
	street: text().notNull(),
	number: text().notNull(),
	complement: text(),
	city: text().notNull(),
	state: text().notNull(),
	neighborhood: text().notNull(),
	zipCode: text().notNull(),
	country: text().notNull(),
	phone: text().notNull(),
	email: text().notNull(),
	cpfOrCnpj: text().notNull(),
	totalPriceInCents: integer("total_price_in_cents").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "order_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shippingAddressId],
			foreignColumns: [shippingAddress.id],
			name: "order_shipping_address_id_shipping_address_id_fk"
		}).onDelete("set null"),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const orderItem = pgTable("order_item", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productVariantId: uuid("product_variant_id").notNull(),
	quantity: integer().notNull(),
	priceInCents: integer("price_in_cents").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [order.id],
			name: "order_item_order_id_order_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariant.id],
			name: "order_item_product_variant_id_product_variant_id_fk"
		}).onDelete("restrict"),
]);

export const product = pgTable("product", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id").notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "product_category_id_category_id_fk"
		}).onDelete("set null"),
	unique("product_slug_unique").on(table.slug),
]);

export const shippingAddress = pgTable("shipping_address", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	recipientName: text().notNull(),
	street: text().notNull(),
	number: text().notNull(),
	complement: text(),
	city: text().notNull(),
	state: text().notNull(),
	neighborhood: text().notNull(),
	zipCode: text().notNull(),
	country: text().notNull(),
	phone: text().notNull(),
	email: text().notNull(),
	cpfOrCnpj: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "shipping_address_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const cartItem = pgTable("cart_item", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id").notNull(),
	productVariantId: uuid("product_variant_id").notNull(),
	quantity: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_item_cart_id_cart_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariant.id],
			name: "cart_item_product_variant_id_product_variant_id_fk"
		}).onDelete("cascade"),
]);

export const adminUserTable = pgTable("admin_user_table", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	adminRules: adminVariantRules("admin_rules").default('superadmin').notNull(),
	username: text().notNull(),
	password: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("admin_user_table_email_unique").on(table.email),
]);

export const adminAccountTable = pgTable("admin_account_table", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [adminUserTable.id],
			name: "admin_account_table_user_id_admin_user_table_id_fk"
		}).onDelete("cascade"),
]);

export const adminSessionTable = pgTable("admin_session_table", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [adminUserTable.id],
			name: "admin_session_table_user_id_admin_user_table_id_fk"
		}).onDelete("cascade"),
	unique("admin_session_table_token_unique").on(table.token),
]);
