// Blueprints Parser Types

export interface CMTypeInput {
  name: string;
  suffix?: string;
  dataType: string;
  ioType?: string;
  comment?: string;
  primary?: boolean;
  isError?: boolean;
  configurable?: boolean;
  trueWords?: string;
  falseWords?: string;
  loopback?: boolean;
  enumType?: string;
}

export interface CMTypeOutput {
  name: string;
  suffix?: string;
  dataType: string;
  ioType?: string;
  comment?: string;
  primary?: boolean;
  isError?: boolean;
  configurable?: boolean;
  trueWords?: string;
  falseWords?: string;
  loopback?: boolean;
  enumType?: string;
}

export interface CMTypeInOut {
  name: string;
  suffix?: string;
  dataType: string;
  ioType?: string;
  comment?: string;
}

export interface ParsedCMType {
  name: string;
  inputs: CMTypeInput[];
  outputs: CMTypeOutput[];
  inOuts: CMTypeInOut[];
  sourceFile?: string;
}

export interface CMInstanceRow {
  name: string;
  instanceNumber?: number;
  controller?: string;
  unitInstance?: string;
  pidDrawing?: string;
  comment?: string;
  configuration: Record<string, any>;
}

export interface ParsedCMInstances {
  cmTypeName: string;
  instances: CMInstanceRow[];
  sourceFile?: string;
}

export interface UnitTypeVariable {
  name: string;
  dataType: string;
  comment?: string;
  unit?: string;
  enumType?: string;
}

export interface ParsedUnitType {
  name: string;
  description?: string;
  variables: UnitTypeVariable[];
  sourceFile?: string;
}

export interface UnitInstanceRow {
  name: string;
  instanceNumber?: number;
  controller?: string;
  unitType: string;
  pidDrawing?: string;
  processCell?: string;
  area?: string;
  comment?: string;
}

export interface ParsedUnitInstances {
  unitTypeName: string;
  instances: UnitInstanceRow[];
  sourceFile?: string;
}

export interface PhaseLinkedModule {
  name: string;
  type: string;
  dynamic?: boolean;
  connectionType?: string;
  comment?: string;
}

export interface PhaseVariable {
  name: string;
  dataType: string;
  comment?: string;
  defaultFromInstance?: boolean;
  unit?: string;
  enumType?: string;
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface PhaseSequenceStep {
  step: number;
  actions: string[];
  conditions: Array<{
    condition: string;
    target: number;
  }>;
}

export interface PhaseSequence {
  name: string;
  steps: PhaseSequenceStep[];
}

export interface ParsedPhaseType {
  name: string;
  description?: string;
  linkedModules: PhaseLinkedModule[];
  inputs: PhaseVariable[];
  outputs: PhaseVariable[];
  inOuts: PhaseVariable[];
  internalValues: PhaseVariable[];
  hmiParameters: PhaseVariable[];
  recipeParameters: PhaseVariable[];
  reportParameters: PhaseVariable[];
  sequences: Record<string, PhaseSequence>;
  sourceFile?: string;
}

export interface BlueprintImportResult {
  success: boolean;
  cmTypes: ParsedCMType[];
  cmInstances: ParsedCMInstances[];
  unitTypes: ParsedUnitType[];
  unitInstances: ParsedUnitInstances[];
  phaseTypes: ParsedPhaseType[];
  errors: string[];
  warnings: string[];
}
