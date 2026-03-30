import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { nanoid } from 'nanoid'
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp(
    "updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// todo for other table 
export const product = pgTable("product", {
  id: text("id").primaryKey().$default(nanoid),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(), // or numeric if needed
  image: text("image"),
  stock: text("stock").notNull(),
  categoryId: text("category_id"),
  howToUse: text("how_to_use"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey().$default(nanoid),
  productId: text("product_id").notNull(),
  url: text("url").notNull(),
});

export const curePductImages = pgTable("product_cure_images", {
  id: text("id").primaryKey().$default(nanoid),
  productId: text("product_id").notNull(),
  url: text("url").notNull(),
});


export const category = pgTable("category", {
  id: text("id").primaryKey().$default(nanoid),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
});

export const cart = pgTable("cart", {
  id: text("id").primaryKey().$default(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItem = pgTable("cart_item", {
  id: text("id").primaryKey().$default(nanoid),
  cartId: text("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  quantity: text("quantity").notNull(),
});

export const order = pgTable("order", {
  id: text("id").primaryKey().$default(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  totalAmount: text("total_amount").notNull(),
  status: text("status").default("pending"), // pending, paid, shipped, delivered, cancelled
  paymentMethod: text("payment_method").notNull().default("prepaid"), // prepaid, cod
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  addressId: text("address_id")
    .notNull()
    .references(() => address.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItem = pgTable("order_item", {
  id: text("id").primaryKey().$default(nanoid),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  quantity: text("quantity").notNull(),
  price: text("price").notNull(),
});

export const address = pgTable("address", {
  id: text("id").primaryKey().$default(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  addressLine: text("address_line").notNull(),
});

export const shipment = pgTable("shipment", {
  id: text("id").primaryKey().$default(nanoid),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  shiprocketOrderId: text("shiprocket_order_id").notNull(),
  shiprocketShipmentId: text("shiprocket_shipment_id"),
  trackingId: text("tracking_id"),
  courier: text("courier"),
  status: text("status").default("processing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payment = pgTable("payment", {
  id: text("id").primaryKey().$default(nanoid),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id),
  provider: text("provider"), // stripe, razorpay
  status: text("status"),
  paymentId: text("payment_id"),
});
export const review = pgTable("review", {
  id: text("id").primaryKey().$default(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  rating: text("rating").notNull(),
  comment: text("comment"),
});
