import { relations } from "drizzle-orm/relations";
import { user, cart, shippingAddress, product, productVariant, session, order, account, orderItem, category, cartItem, adminUserTable, adminAccountTable, adminSessionTable } from "./schema";

export const cartRelations = relations(cart, ({one, many}) => ({
	user: one(user, {
		fields: [cart.userId],
		references: [user.id]
	}),
	shippingAddress: one(shippingAddress, {
		fields: [cart.shippingAddressId],
		references: [shippingAddress.id]
	}),
	cartItems: many(cartItem),
}));

export const userRelations = relations(user, ({many}) => ({
	carts: many(cart),
	sessions: many(session),
	orders: many(order),
	accounts: many(account),
	shippingAddresses: many(shippingAddress),
}));

export const shippingAddressRelations = relations(shippingAddress, ({one, many}) => ({
	carts: many(cart),
	orders: many(order),
	user: one(user, {
		fields: [shippingAddress.userId],
		references: [user.id]
	}),
}));

export const productVariantRelations = relations(productVariant, ({one, many}) => ({
	product: one(product, {
		fields: [productVariant.productId],
		references: [product.id]
	}),
	orderItems: many(orderItem),
	cartItems: many(cartItem),
}));

export const productRelations = relations(product, ({one, many}) => ({
	productVariants: many(productVariant),
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id]
	}),
	shippingAddress: one(shippingAddress, {
		fields: [order.shippingAddressId],
		references: [shippingAddress.id]
	}),
	orderItems: many(orderItem),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const orderItemRelations = relations(orderItem, ({one}) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id]
	}),
	productVariant: one(productVariant, {
		fields: [orderItem.productVariantId],
		references: [productVariant.id]
	}),
}));

export const categoryRelations = relations(category, ({many}) => ({
	products: many(product),
}));

export const cartItemRelations = relations(cartItem, ({one}) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id]
	}),
	productVariant: one(productVariant, {
		fields: [cartItem.productVariantId],
		references: [productVariant.id]
	}),
}));

export const adminAccountTableRelations = relations(adminAccountTable, ({one}) => ({
	adminUserTable: one(adminUserTable, {
		fields: [adminAccountTable.userId],
		references: [adminUserTable.id]
	}),
}));

export const adminUserTableRelations = relations(adminUserTable, ({many}) => ({
	adminAccountTables: many(adminAccountTable),
	adminSessionTables: many(adminSessionTable),
}));

export const adminSessionTableRelations = relations(adminSessionTable, ({one}) => ({
	adminUserTable: one(adminUserTable, {
		fields: [adminSessionTable.userId],
		references: [adminUserTable.id]
	}),
}));