import type { InsertVendor, InsertDataTypeMapping } from "@shared/schema";

// Default vendor definitions
export const defaultVendors: InsertVendor[] = [
  {
    name: "siemens",
    displayName: "Siemens",
    description: "Siemens Industrial Automation - TIA Portal, S7 PLCs",
    platforms: ["TIA Portal", "STEP 7", "WinCC"],
    languages: ["SCL", "LAD", "FBD", "STL", "GRAPH"],
    configSchema: {
      plcTypes: ["S7-300", "S7-400", "S7-1200", "S7-1500"],
      hmiTypes: ["Basic Panel", "Comfort Panel", "WinCC Runtime"],
      communicationProtocols: ["PROFINET", "PROFIBUS", "MPI", "Ethernet/IP"],
    },
    isActive: true,
  },
  {
    name: "rockwell",
    displayName: "Rockwell Automation",
    description: "Rockwell Automation - Studio 5000, ControlLogix, CompactLogix",
    platforms: ["Studio 5000", "RSLogix 5000", "FactoryTalk"],
    languages: ["Ladder", "ST", "FBD", "SFC", "AOI"],
    configSchema: {
      plcTypes: ["ControlLogix", "CompactLogix", "MicroLogix", "SLC 500"],
      hmiTypes: ["PanelView", "FactoryTalk View SE", "FactoryTalk View ME"],
      communicationProtocols: ["EtherNet/IP", "ControlNet", "DeviceNet", "DH+"],
    },
    isActive: true,
  },
  {
    name: "abb",
    displayName: "ABB",
    description: "ABB Industrial Automation - Ability, AC500, AC800M",
    platforms: ["Automation Builder", "Freelance", "800xA"],
    languages: ["ST", "LAD", "FBD", "IL", "CFC"],
    configSchema: {
      plcTypes: ["AC500", "AC500-eCo", "AC500-XC"],
      dcsTypes: ["AC800M", "AC800F"],
      communicationProtocols: ["PROFINET", "EtherNet/IP", "Modbus TCP", "PROFIBUS"],
    },
    isActive: true,
  },
  {
    name: "emerson",
    displayName: "Emerson",
    description: "Emerson Automation Solutions - DeltaV, Ovation",
    platforms: ["DeltaV", "Ovation", "PACSystems"],
    languages: ["ST", "FBD", "SFC", "CFC"],
    configSchema: {
      dcsTypes: ["DeltaV S-series", "DeltaV M-series"],
      controllerTypes: ["MD Plus", "MD Controller"],
      communicationProtocols: ["Foundation Fieldbus", "HART", "WirelessHART", "Ethernet"],
    },
    isActive: true,
  },
  {
    name: "schneider",
    displayName: "Schneider Electric",
    description: "Schneider Electric - EcoStruxure, Modicon",
    platforms: ["EcoStruxure Control Expert", "Unity Pro", "SoMachine"],
    languages: ["ST", "LAD", "FBD", "IL", "SFC"],
    configSchema: {
      plcTypes: ["Modicon M340", "Modicon M580", "Modicon Premium", "Modicon Quantum"],
      hmiTypes: ["Magelis", "Vijeo Designer"],
      communicationProtocols: ["Modbus TCP", "Modbus RTU", "EtherNet/IP", "PROFIBUS"],
    },
    isActive: true,
  },
];

// Canonical data types used across all vendors
export const canonicalDataTypes = [
  "Bool",
  "Int",
  "DInt",
  "Real",
  "LReal",
  "String",
  "Time",
  "Date",
  "DateTime",
  "Word",
  "DWord",
  "Byte",
  "Array",
  "Struct",
  "Enum",
];

// Data type mappings for Siemens
export const siemensDataTypeMappings: Omit<InsertDataTypeMapping, "vendorId">[] = [
  { canonicalType: "Bool", vendorType: "Bool" },
  { canonicalType: "Int", vendorType: "Int" },
  { canonicalType: "DInt", vendorType: "DInt" },
  { canonicalType: "Real", vendorType: "Real" },
  { canonicalType: "LReal", vendorType: "LReal" },
  { canonicalType: "String", vendorType: "String", size: 254 },
  { canonicalType: "Time", vendorType: "Time" },
  { canonicalType: "Date", vendorType: "Date" },
  { canonicalType: "DateTime", vendorType: "Date_And_Time" },
  { canonicalType: "Word", vendorType: "Word" },
  { canonicalType: "DWord", vendorType: "DWord" },
  { canonicalType: "Byte", vendorType: "Byte" },
];

// Data type mappings for Rockwell
export const rockwellDataTypeMappings: Omit<InsertDataTypeMapping, "vendorId">[] = [
  { canonicalType: "Bool", vendorType: "BOOL" },
  { canonicalType: "Int", vendorType: "INT" },
  { canonicalType: "DInt", vendorType: "DINT" },
  { canonicalType: "Real", vendorType: "REAL" },
  { canonicalType: "LReal", vendorType: "LREAL" },
  { canonicalType: "String", vendorType: "STRING", size: 82 },
  { canonicalType: "Time", vendorType: "TIMER" },
  { canonicalType: "Date", vendorType: "DATE" },
  { canonicalType: "DateTime", vendorType: "DATE_AND_TIME" },
  { canonicalType: "Word", vendorType: "INT" },
  { canonicalType: "DWord", vendorType: "DINT" },
  { canonicalType: "Byte", vendorType: "SINT" },
];

// Data type mappings for ABB
export const abbDataTypeMappings: Omit<InsertDataTypeMapping, "vendorId">[] = [
  { canonicalType: "Bool", vendorType: "BOOL" },
  { canonicalType: "Int", vendorType: "INT" },
  { canonicalType: "DInt", vendorType: "DINT" },
  { canonicalType: "Real", vendorType: "REAL" },
  { canonicalType: "LReal", vendorType: "LREAL" },
  { canonicalType: "String", vendorType: "STRING" },
  { canonicalType: "Time", vendorType: "TIME" },
  { canonicalType: "Date", vendorType: "DATE" },
  { canonicalType: "DateTime", vendorType: "DATE_AND_TIME" },
  { canonicalType: "Word", vendorType: "WORD" },
  { canonicalType: "DWord", vendorType: "DWORD" },
  { canonicalType: "Byte", vendorType: "BYTE" },
];

// Rockwell AOI template structure
export const rockwellAOITemplate = `
// Add-On Instruction: {{CM_NAME}}
// Generated by 0xSCADA Blueprints Engine
// Version: {{VERSION}}
// Date: {{GENERATED_DATE}}

ROUTINE MainRoutine
  // Input Processing
  {{#each INPUTS}}
  // {{comment}}
  {{/each}}
  
  // Main Logic
  {{MAIN_LOGIC}}
  
  // Output Processing
  {{#each OUTPUTS}}
  // {{comment}}
  {{/each}}
END_ROUTINE

// Parameters
{{#each INPUTS}}
InOut {{name}} : {{dataType}};
{{/each}}
{{#each OUTPUTS}}
InOut {{name}} : {{dataType}};
{{/each}}
`;

// Siemens SCL template structure (from blueprints)
export const siemensSCLTemplate = `
// Function Block: {{CM_NAME}}
// Generated by 0xSCADA Blueprints Engine
// Version: {{VERSION}}
// Date: {{GENERATED_DATE}}

FUNCTION_BLOCK "{{CM_NAME}}"
{ S7_Optimized_Access := 'TRUE' }
VERSION : {{VERSION}}

VAR_INPUT
{{#each INPUTS}}
    {{name}} : {{dataType}}; // {{comment}}
{{/each}}
END_VAR

VAR_OUTPUT
{{#each OUTPUTS}}
    {{name}} : {{dataType}}; // {{comment}}
{{/each}}
END_VAR

VAR_IN_OUT
{{#each INOUTS}}
    {{name}} : {{dataType}}; // {{comment}}
{{/each}}
END_VAR

VAR
    // Internal variables
END_VAR

BEGIN
    {{MAIN_LOGIC}}
END_FUNCTION_BLOCK
`;
