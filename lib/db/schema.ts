import { pgTable, text, integer, boolean, timestamp, serial, varchar, jsonb } from "drizzle-orm/pg-core";

// Admin users
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // bcrypt hash
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"), // 'superadmin' | 'admin'
  module: varchar("module", { length: 50 }), // 'spa' | 'restaurantes' | 'actividades' | 'familia' | 'habitacion'
  createdAt: timestamp("created_at").defaultNow(),
});

// Active alerts shown on home
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"), // 'info' | 'warning' | 'closed'
  active: boolean("active").notNull().default(true),
  translations: jsonb("translations").$type<{ en?: { title?: string; message?: string }; pt?: { title?: string; message?: string } }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Spa services (Spa Alunco)
export const spaServices = pgTable("spa_services", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 100 }),
  price: varchar("price", { length: 100 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { name?: string; description?: string }; pt?: { name?: string; description?: string } }>(),
});

// Spa schedules
export const spaSchedules = pgTable("spa_schedules", {
  id: serial("id").primaryKey(),
  venue: varchar("venue", { length: 100 }).notNull(), // 'spa' | 'tratamientos' | 'peluqueria'
  hours: varchar("hours", { length: 100 }).notNull(),
  active: boolean("active").notNull().default(true),
});

// Gym classes
export const gymClasses = pgTable("gym_classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }),
  schedule: varchar("schedule", { length: 100 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { name?: string; description?: string }; pt?: { name?: string; description?: string } }>(),
});

// Restaurant items (Arboleda, La Grieta, Muffin)
export const restaurantItems = pgTable("restaurant_items", {
  id: serial("id").primaryKey(),
  restaurant: varchar("restaurant", { length: 100 }).notNull(), // 'arboleda' | 'lagrieta' | 'muffin'
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { name?: string; description?: string }; pt?: { name?: string; description?: string } }>(),
});

// Restaurant schedules
export const restaurantSchedules = pgTable("restaurant_schedules", {
  id: serial("id").primaryKey(),
  restaurant: varchar("restaurant", { length: 100 }).notNull(),
  info: text("info").notNull(),
  active: boolean("active").notNull().default(true),
});

// Activities (Experiencias)
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  season: varchar("season", { length: 50 }).notNull(), // 'verano' | 'invierno'
  category: varchar("category", { length: 150 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  image: varchar("image", { length: 500 }),
  translations: jsonb("translations").$type<{ en?: { name?: string; description?: string }; pt?: { name?: string; description?: string } }>(),
});

// Family programs
export const familyPrograms = pgTable("family_programs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(), // 'club' | 'guarderia' | 'actividad'
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  schedule: varchar("schedule", { length: 255 }),
  season: varchar("season", { length: 50 }), // 'verano' | 'invierno' | null
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  image: varchar("image", { length: 500 }),
  translations: jsonb("translations").$type<{ en?: { name?: string; description?: string }; pt?: { name?: string; description?: string } }>(),
});

// Room products
export const roomProducts = pgTable("room_products", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: varchar("price", { length: 100 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
});

// Room information (housekeeping, security, etc.)
export const roomInfo = pgTable("room_info", {
  id: serial("id").primaryKey(),
  section: varchar("section", { length: 100 }).notNull(), // 'housekeeping' | 'emergencia' | 'caja' | 'protocolo' | 'convivencia'
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { title?: string; content?: string }; pt?: { title?: string; content?: string } }>(),
});

// Upcoming events shown on home
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  day: varchar("day", { length: 10 }).notNull(),
  month: varchar("month", { length: 20 }).notNull(),
  time: varchar("time", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { title?: string; description?: string }; pt?: { title?: string; description?: string } }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generic information pages (Circuitos, Sala de Yoga, Piscinas, Mi Estadía, Programa del
// Viajero, Estacionamientos, Tiendas, etc.) — one row per content block within a page.
export const infoPages = pgTable("info_pages", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 100 }).notNull(), // slug, e.g. 'circuitos-hidrotermales'
  pageTitle: varchar("page_title", { length: 255 }).notNull(), // display title / hero
  block: varchar("block", { length: 50 }).notNull().default("text"), // 'text' | 'list' | 'price' | 'note' | 'intro'
  title: varchar("title", { length: 255 }),
  content: text("content"),
  image: varchar("image", { length: 500 }),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  translations: jsonb("translations").$type<{ en?: { title?: string; content?: string }; pt?: { title?: string; content?: string } }>(),
});

// Activity logs — registry of all guest & admin actions
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'guest' | 'admin'
  action: varchar("action", { length: 100 }).notNull(), // e.g. 'login' | 'view_spa' | 'create_service' | 'delete_item'
  module: varchar("module", { length: 100 }), // 'spa' | 'restaurantes' | 'actividades' | etc.
  actorName: varchar("actor_name", { length: 255 }), // guest name or admin name
  actorEmail: varchar("actor_email", { length: 255 }), // guest email or admin email
  details: text("details"), // extra JSON or human-readable description
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings — key/value store for admin-configurable settings
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
