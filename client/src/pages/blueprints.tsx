import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchVendors, 
  fetchControlModuleTypes, 
  fetchUnitTypes, 
  fetchPhaseTypes,
  fetchBlueprintsSummary,
  fetchGeneratedCode,
  seedDatabase,
  generateControlModuleCode,
  generatePhaseCode,
} from "@/lib/api";
import { 
  Boxes, 
  Cpu, 
  Workflow, 
  Code2, 
  Download, 
  Database,
  ChevronRight,
  Play,
  Copy,
  Check,
  Loader2,
  Factory,
  Settings,
  FileCode,
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TabType = "cm-types" | "units" | "phases" | "generated";

export default function Blueprints() {
  const [activeTab, setActiveTab] = useState<TabType>("cm-types");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  const { data: cmTypes = [] } = useQuery({
    queryKey: ["cmTypes"],
    queryFn: fetchControlModuleTypes,
  });

  const { data: unitTypes = [] } = useQuery({
    queryKey: ["unitTypes"],
    queryFn: fetchUnitTypes,
  });

  const { data: phaseTypes = [] } = useQuery({
    queryKey: ["phaseTypes"],
    queryFn: fetchPhaseTypes,
  });

  const { data: summary } = useQuery({
    queryKey: ["blueprintsSummary"],
    queryFn: fetchBlueprintsSummary,
  });

  const { data: generatedCodeList = [] } = useQuery({
    queryKey: ["generatedCode"],
    queryFn: fetchGeneratedCode,
  });

  const seedMutation = useMutation({
    mutationFn: seedDatabase,
    onSuccess: (data) => {
      toast({
        title: "Database Seeded",
        description: `Created ${data.vendors} vendors, ${data.dataTypeMappings} mappings, ${data.templatePackages} templates`,
      });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["blueprintsSummary"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Seed Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async ({ type, id, vendorId }: { type: "cm" | "phase"; id: string; vendorId: string }) => {
      if (type === "cm") {
        return generateControlModuleCode(id, vendorId);
      } else {
        return generatePhaseCode(id, vendorId);
      }
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      toast({
        title: "Code Generated",
        description: `${data.language} code generated for ${data.vendor}`,
      });
      queryClient.invalidateQueries({ queryKey: ["generatedCode"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    if (!selectedItem || !selectedVendor) {
      toast({
        title: "Missing Selection",
        description: "Please select an item and vendor",
        variant: "destructive",
      });
      return;
    }

    const type = activeTab === "phases" ? "phase" : "cm";
    generateMutation.mutate({ type, id: selectedItem.id, vendorId: selectedVendor });
  };

  const tabs = [
    { id: "cm-types" as TabType, label: "Control Modules", icon: Cpu, count: cmTypes.length },
    { id: "units" as TabType, label: "Units", icon: Boxes, count: unitTypes.length },
    { id: "phases" as TabType, label: "Phases", icon: Workflow, count: phaseTypes.length },
    { id: "generated" as TabType, label: "Generated Code", icon: FileCode, count: generatedCodeList.length },
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case "cm-types": return cmTypes;
      case "units": return unitTypes;
      case "phases": return phaseTypes;
      case "generated": return generatedCodeList;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end border-b border-primary/20 pb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold uppercase flex items-center gap-3">
              <Factory className="w-8 h-8 text-primary" />
              Blueprints Engine
            </h1>
            <p className="text-muted-foreground text-sm">
              Design-Ops Workflow // Multi-Vendor Code Generation
            </p>
          </div>
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs uppercase px-4 py-2 border border-primary/50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {seedMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            Seed Vendors
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="CM Types" value={summary?.cmTypes || 0} icon={Cpu} />
          <StatCard label="Unit Types" value={summary?.unitTypes || 0} icon={Boxes} />
          <StatCard label="Phase Types" value={summary?.phaseTypes || 0} icon={Workflow} />
          <StatCard label="Vendors" value={summary?.vendors || 0} icon={Settings} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedItem(null);
                setGeneratedCode("");
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm uppercase transition-all border ${
                activeTab === tab.id
                  ? "bg-primary text-black border-primary"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-primary/50 hover:text-primary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item List */}
          <div className="lg:col-span-1 border border-white/10 bg-white/5 p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary" />
              {activeTab === "cm-types" && "Control Module Types"}
              {activeTab === "units" && "Unit Types"}
              {activeTab === "phases" && "Phase Types"}
              {activeTab === "generated" && "Generated Code History"}
            </h3>

            {getCurrentItems().length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                No items found. Import blueprints or seed the database.
              </div>
            ) : (
              <div className="space-y-2">
                {getCurrentItems().map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      if (activeTab === "generated") {
                        setGeneratedCode(item.code || "");
                      } else {
                        setGeneratedCode("");
                      }
                    }}
                    className={`p-3 border cursor-pointer transition-all ${
                      selectedItem?.id === item.id
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                    }`}
                  >
                    <div className="font-bold text-sm">{item.name}</div>
                    {item.version && (
                      <div className="text-xs text-muted-foreground">v{item.version}</div>
                    )}
                    {item.language && (
                      <div className="text-xs text-primary mt-1">{item.language}</div>
                    )}
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Details */}
            {selectedItem && activeTab !== "generated" && (
              <div className="border border-white/10 bg-white/5 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-heading font-bold">{selectedItem.name}</h2>
                    {selectedItem.version && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 mt-2 inline-block">
                        v{selectedItem.version}
                      </span>
                    )}
                  </div>
                </div>

                {selectedItem.description && (
                  <p className="text-sm text-muted-foreground mb-6">{selectedItem.description}</p>
                )}

                {/* I/O Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {selectedItem.inputs && (
                    <div className="border border-white/10 p-4">
                      <h4 className="text-xs font-bold uppercase text-green-400 mb-3">Inputs</h4>
                      <div className="space-y-2">
                        {(selectedItem.inputs as any[]).slice(0, 5).map((input: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="text-primary">{input.name}</span>
                            <span className="text-muted-foreground ml-2">: {input.dataType}</span>
                          </div>
                        ))}
                        {(selectedItem.inputs as any[]).length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            +{(selectedItem.inputs as any[]).length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem.outputs && (
                    <div className="border border-white/10 p-4">
                      <h4 className="text-xs font-bold uppercase text-blue-400 mb-3">Outputs</h4>
                      <div className="space-y-2">
                        {(selectedItem.outputs as any[]).slice(0, 5).map((output: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="text-primary">{output.name}</span>
                            <span className="text-muted-foreground ml-2">: {output.dataType}</span>
                          </div>
                        ))}
                        {(selectedItem.outputs as any[]).length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            +{(selectedItem.outputs as any[]).length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem.inOuts && (selectedItem.inOuts as any[]).length > 0 && (
                    <div className="border border-white/10 p-4">
                      <h4 className="text-xs font-bold uppercase text-yellow-400 mb-3">InOuts</h4>
                      <div className="space-y-2">
                        {(selectedItem.inOuts as any[]).slice(0, 5).map((inout: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="text-primary">{inout.name}</span>
                            <span className="text-muted-foreground ml-2">: {inout.dataType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Code Generation */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-sm font-bold uppercase mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    Generate Code
                  </h4>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground uppercase block mb-2">
                        Target Vendor
                      </label>
                      <select
                        value={selectedVendor}
                        onChange={(e) => setSelectedVendor(e.target.value)}
                        className="w-full bg-black border border-white/20 px-3 py-2 text-sm focus:border-primary outline-none"
                      >
                        <option value="">Select Vendor...</option>
                        {vendors.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!selectedVendor || generateMutation.isPending}
                      className="bg-primary hover:bg-primary/80 text-black font-mono font-bold text-xs uppercase px-6 py-2 border border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {generateMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Code Display */}
            {(generatedCode || (selectedItem && activeTab === "generated")) && (
              <div className="border border-white/10 bg-white/5 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-primary" />
                    Generated Code
                    {selectedItem?.language && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 ml-2">
                        {selectedItem.language}
                      </span>
                    )}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {selectedItem?.codeHash && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono">{selectedItem.codeHash.slice(0, 16)}...</span>
                  </div>
                )}

                <pre className="bg-black/50 border border-white/10 p-4 overflow-x-auto text-xs max-h-[400px] overflow-y-auto">
                  <code className="text-green-400">
                    {generatedCode || selectedItem?.code || "// No code generated yet"}
                  </code>
                </pre>
              </div>
            )}

            {/* Empty State */}
            {!selectedItem && (
              <div className="border border-dashed border-white/20 p-12 text-center">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Select an Item</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a Control Module, Unit, or Phase from the list to view details and generate code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-muted-foreground uppercase">{label}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-2xl font-heading font-bold">{value}</div>
    </div>
  );
}
