import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sites
export const sites = pgTable("sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull().default("ONLINE"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSiteSchema = createInsertSchema(sites).omit({
  id: true,
  createdAt: true,
});

export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sites.$inferSelect;

// Assets
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteId: text("site_id").notNull().references(() => sites.id),
  assetType: text("asset_type").notNull(),
  nameOrTag: text("name_or_tag").notNull(),
  critical: boolean("critical").notNull().default(false),
  metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  status: text("status").notNull().default("OK"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
});

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Event Anchors
export const eventAnchors = pgTable("event_anchors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: text("asset_id").notNull().references(() => assets.id),
  eventType: text("event_type").notNull(),
  payloadHash: text("payload_hash").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  recordedBy: text("recorded_by").notNull(),
  txHash: text("tx_hash"),
  details: text("details").notNull(),
  fullPayload: jsonb("full_payload").notNull(),
});

export const insertEventAnchorSchema = createInsertSchema(eventAnchors).omit({
  id: true,
});

export type InsertEventAnchor = z.infer<typeof insertEventAnchorSchema>;
export type EventAnchor = typeof eventAnchors.$inferSelect;

// Maintenance Records
export const maintenanceRecords = pgTable("maintenance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: text("asset_id").notNull().references(() => assets.id),
  workOrderId: text("work_order_id").notNull(),
  performedBy: text("performed_by").notNull(),
  maintenanceType: text("maintenance_type").notNull(),
  performedAt: timestamp("performed_at").notNull(),
  nextDueAt: timestamp("next_due_at"),
  notes: text("notes"),
  attachmentHash: text("attachment_hash"),
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({
  id: true,
});

export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Vendor Support
// ============================================================================

// Vendors (Siemens, Rockwell, ABB, Emerson, etc.)
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  // Platform identifiers (e.g., "TIA Portal", "Studio 5000", "DCS800")
  platforms: jsonb("platforms").notNull().default(sql`'[]'::jsonb`),
  // Supported programming languages (SCL, Ladder, ST, AOI, etc.)
  languages: jsonb("languages").notNull().default(sql`'[]'::jsonb`),
  // Vendor-specific configuration schema
  configSchema: jsonb("config_schema").notNull().default(sql`'{}'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Template Packages (SCL templates, AOI templates, etc.)
export const templatePackages = pgTable("template_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  version: text("version").notNull().default("1.0.0"),
  description: text("description"),
  // Template type: "control_module", "phase", "unit", "equipment_module"
  templateType: text("template_type").notNull(),
  // Programming language: "SCL", "ST", "Ladder", "FBD", "AOI"
  language: text("language").notNull(),
  // The actual template content with placeholders
  templateContent: text("template_content").notNull(),
  // Placeholder definitions and their mappings
  placeholders: jsonb("placeholders").notNull().default(sql`'[]'::jsonb`),
  // Required inputs for code generation
  requiredInputs: jsonb("required_inputs").notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTemplatePackageSchema = createInsertSchema(templatePackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplatePackage = z.infer<typeof insertTemplatePackageSchema>;
export type TemplatePackage = typeof templatePackages.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Control Module Types & Instances
// ============================================================================

// Control Module Types (PIDController, AnalogValve, VFD, etc.)
export const controlModuleTypes = pgTable("control_module_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  vendorId: text("vendor_id").references(() => vendors.id),
  // Version for tracking changes
  version: text("version").notNull().default("1.0.0"),
  description: text("description"),
  inputs: jsonb("inputs").notNull().default(sql`'[]'::jsonb`),
  outputs: jsonb("outputs").notNull().default(sql`'[]'::jsonb`),
  inOuts: jsonb("in_outs").notNull().default(sql`'[]'::jsonb`),
  // Vendor-specific data types mapping
  dataTypeMappings: jsonb("data_type_mappings").notNull().default(sql`'{}'::jsonb`),
  // Associated template package for code generation
  templatePackageId: text("template_package_id").references(() => templatePackages.id),
  sourcePackage: text("source_package"),
  // ISA-88 classification: "basic", "equipment_module", "control_module"
  classification: text("classification").default("control_module"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertControlModuleTypeSchema = createInsertSchema(controlModuleTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertControlModuleType = z.infer<typeof insertControlModuleTypeSchema>;
export type ControlModuleType = typeof controlModuleTypes.$inferSelect;

// Control Module Instances (actual instances like PICSA4712_02, TT4750_03)
export const controlModuleInstances = pgTable("control_module_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  instanceNumber: integer("instance_number"),
  controlModuleTypeId: text("control_module_type_id").notNull().references(() => controlModuleTypes.id),
  controllerId: text("controller_id"),
  unitInstanceId: text("unit_instance_id"),
  pidDrawing: text("pid_drawing"),
  comment: text("comment"),
  configuration: jsonb("configuration").notNull().default(sql`'{}'::jsonb`),
  currentState: jsonb("current_state").notNull().default(sql`'{}'::jsonb`),
  siteId: text("site_id").references(() => sites.id),
  assetId: text("asset_id").references(() => assets.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertControlModuleInstanceSchema = createInsertSchema(controlModuleInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertControlModuleInstance = z.infer<typeof insertControlModuleInstanceSchema>;
export type ControlModuleInstance = typeof controlModuleInstances.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Unit Types & Instances
// ============================================================================

// Unit Types (Tank, Reactor, etc.)
export const unitTypes = pgTable("unit_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  vendorId: text("vendor_id").references(() => vendors.id),
  version: text("version").notNull().default("1.0.0"),
  description: text("description"),
  variables: jsonb("variables").notNull().default(sql`'[]'::jsonb`),
  // Equipment modules that belong to this unit type
  equipmentModules: jsonb("equipment_modules").notNull().default(sql`'[]'::jsonb`),
  // Associated template package for code generation
  templatePackageId: text("template_package_id").references(() => templatePackages.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUnitTypeSchema = createInsertSchema(unitTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUnitType = z.infer<typeof insertUnitTypeSchema>;
export type UnitType = typeof unitTypes.$inferSelect;

// Unit Instances (T4750, R4800, etc.)
export const unitInstances = pgTable("unit_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  instanceNumber: integer("instance_number"),
  unitTypeId: text("unit_type_id").notNull().references(() => unitTypes.id),
  controllerId: text("controller_id"),
  pidDrawing: text("pid_drawing"),
  processCell: text("process_cell"),
  area: text("area"),
  comment: text("comment"),
  siteId: text("site_id").references(() => sites.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUnitInstanceSchema = createInsertSchema(unitInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUnitInstance = z.infer<typeof insertUnitInstanceSchema>;
export type UnitInstance = typeof unitInstances.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Phase Types & Instances
// ============================================================================

// Phase Types (DemoPhase, etc. - ISA-88 batch control)
export const phaseTypes = pgTable("phase_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  vendorId: text("vendor_id").references(() => vendors.id),
  version: text("version").notNull().default("1.0.0"),
  description: text("description"),
  linkedModules: jsonb("linked_modules").notNull().default(sql`'[]'::jsonb`),
  inputs: jsonb("inputs").notNull().default(sql`'[]'::jsonb`),
  outputs: jsonb("outputs").notNull().default(sql`'[]'::jsonb`),
  inOuts: jsonb("in_outs").notNull().default(sql`'[]'::jsonb`),
  internalValues: jsonb("internal_values").notNull().default(sql`'[]'::jsonb`),
  hmiParameters: jsonb("hmi_parameters").notNull().default(sql`'[]'::jsonb`),
  recipeParameters: jsonb("recipe_parameters").notNull().default(sql`'[]'::jsonb`),
  reportParameters: jsonb("report_parameters").notNull().default(sql`'[]'::jsonb`),
  sequences: jsonb("sequences").notNull().default(sql`'{}'::jsonb`),
  // Associated template package for code generation
  templatePackageId: text("template_package_id").references(() => templatePackages.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPhaseTypeSchema = createInsertSchema(phaseTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPhaseType = z.infer<typeof insertPhaseTypeSchema>;
export type PhaseType = typeof phaseTypes.$inferSelect;

// Phase Instances
export const phaseInstances = pgTable("phase_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  instanceNumber: integer("instance_number"),
  phaseTypeId: text("phase_type_id").notNull().references(() => phaseTypes.id),
  unitInstanceId: text("unit_instance_id").references(() => unitInstances.id),
  controllerId: text("controller_id"),
  currentState: text("current_state").default("IDLE"),
  currentStep: integer("current_step").default(0),
  linkedModuleInstances: jsonb("linked_module_instances").notNull().default(sql`'{}'::jsonb`),
  siteId: text("site_id").references(() => sites.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPhaseInstanceSchema = createInsertSchema(phaseInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPhaseInstance = z.infer<typeof insertPhaseInstanceSchema>;
export type PhaseInstance = typeof phaseInstances.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Design Specifications
// ============================================================================

// Design Specifications (versioned FDS documents)
export const designSpecifications = pgTable("design_specifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  version: text("version").notNull(),
  description: text("description"),
  contentHash: text("content_hash").notNull(),
  txHash: text("tx_hash"),
  content: jsonb("content").notNull().default(sql`'{}'::jsonb`),
  siteId: text("site_id").references(() => sites.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  anchoredAt: timestamp("anchored_at"),
});

export const insertDesignSpecificationSchema = createInsertSchema(designSpecifications).omit({
  id: true,
  createdAt: true,
  anchoredAt: true,
});

export type InsertDesignSpecification = z.infer<typeof insertDesignSpecificationSchema>;
export type DesignSpecification = typeof designSpecifications.$inferSelect;

// ============================================================================
// BLUEPRINTS INTEGRATION - Code Generation
// ============================================================================

// Generated Code (output from code generation)
export const generatedCode = pgTable("generated_code", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Source entity type: "control_module", "phase", "unit"
  sourceType: text("source_type").notNull(),
  // Reference to the source entity (CM type, phase type, or unit type)
  sourceId: text("source_id").notNull(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  templatePackageId: text("template_package_id").references(() => templatePackages.id),
  // Programming language used
  language: text("language").notNull(),
  // The generated code content
  code: text("code").notNull(),
  // Hash of the generated code for integrity verification
  codeHash: text("code_hash").notNull(),
  // Blockchain transaction hash if anchored
  txHash: text("tx_hash"),
  // Generation metadata (inputs used, timestamp, etc.)
  metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  // Status: "draft", "reviewed", "approved", "deployed"
  status: text("status").notNull().default("draft"),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
});

export const insertGeneratedCodeSchema = createInsertSchema(generatedCode).omit({
  id: true,
  generatedAt: true,
  approvedAt: true,
});

export type InsertGeneratedCode = z.infer<typeof insertGeneratedCodeSchema>;
export type GeneratedCode = typeof generatedCode.$inferSelect;

// Data Type Mappings (vendor-specific data type translations)
export const dataTypeMappings = pgTable("data_type_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  // Generic/canonical data type name
  canonicalType: text("canonical_type").notNull(),
  // Vendor-specific data type name
  vendorType: text("vendor_type").notNull(),
  // Size/precision info if applicable
  size: integer("size"),
  precision: integer("precision"),
  // Additional mapping metadata
  metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDataTypeMappingSchema = createInsertSchema(dataTypeMappings).omit({
  id: true,
  createdAt: true,
});

export type InsertDataTypeMapping = z.infer<typeof insertDataTypeMappingSchema>;
export type DataTypeMapping = typeof dataTypeMappings.$inferSelect;

// Controllers (PLC/DCS hardware definitions)
export const controllers = pgTable("controllers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  siteId: text("site_id").references(() => sites.id),
  // Controller model/type (e.g., "S7-1500", "ControlLogix 5580")
  model: text("model").notNull(),
  // Firmware version
  firmwareVersion: text("firmware_version"),
  // IP address or communication path
  address: text("address"),
  // Controller-specific configuration
  configuration: jsonb("configuration").notNull().default(sql`'{}'::jsonb`),
  // Status: "online", "offline", "maintenance"
  status: text("status").notNull().default("offline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertControllerSchema = createInsertSchema(controllers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertController = z.infer<typeof insertControllerSchema>;
export type Controller = typeof controllers.$inferSelect;
