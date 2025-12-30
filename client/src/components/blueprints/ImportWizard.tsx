import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportResult {
  success: boolean;
  imported: {
    cmTypes: number;
    cmInstances: number;
    unitTypes: number;
    unitInstances: number;
    phaseTypes: number;
    phaseInstances: number;
  };
  errors: string[];
  warnings: string[];
}

interface ImportWizardProps {
  onClose: () => void;
}

export function ImportWizard({ onClose }: ImportWizardProps) {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/blueprints/import", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
      }
      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      setStep("complete");
      queryClient.invalidateQueries({ queryKey: ["cmTypes"] });
      queryClient.invalidateQueries({ queryKey: ["unitTypes"] });
      queryClient.invalidateQueries({ queryKey: ["phaseTypes"] });
      queryClient.invalidateQueries({ queryKey: ["blueprintsSummary"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
      setStep("upload");
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.name.endsWith(".md") || f.name.endsWith(".csv")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (f) => f.name.endsWith(".md") || f.name.endsWith(".csv")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please select files to import",
        variant: "destructive",
      });
      return;
    }

    setStep("importing");
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    importMutation.mutate(formData);
  };

  const categorizeFiles = () => {
    const cmTypes = files.filter((f) => f.name.startsWith("cm-type-") && f.name.endsWith(".md"));
    const unitTypes = files.filter((f) => f.name.startsWith("unit-type-") && f.name.endsWith(".md"));
    const phaseTypes = files.filter((f) => f.name.startsWith("phase-type-") && f.name.endsWith(".md"));
    const instances = files.filter((f) => f.name.endsWith(".csv"));
    return { cmTypes, unitTypes, phaseTypes, instances };
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-heading font-bold uppercase">Import Blueprints</h2>
            <p className="text-sm text-muted-foreground">
              Upload markdown and CSV files from your blueprints package
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "upload" && (
            <div className="space-y-6">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-white/20 hover:border-primary/50 p-12 text-center transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  multiple
                  accept=".md,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepts: .md (type definitions), .csv (instances)
                  </p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase text-muted-foreground">
                    Selected Files ({files.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(categorizeFiles()).map(([key, items]) => (
                    <div key={key} className="p-3 border border-white/10 bg-white/5">
                      <div className="text-xs text-muted-foreground uppercase mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-xl font-bold">{items.length}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "importing" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-bold mb-2">Importing Blueprints...</h3>
              <p className="text-sm text-muted-foreground">
                Parsing files and validating references
              </p>
            </div>
          )}

          {step === "complete" && result && (
            <div className="space-y-6">
              <div className="text-center">
                {result.success ? (
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-bold mb-2">
                  {result.success ? "Import Complete" : "Import Completed with Warnings"}
                </h3>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ResultCard label="CM Types" value={result.imported.cmTypes} />
                <ResultCard label="CM Instances" value={result.imported.cmInstances} />
                <ResultCard label="Unit Types" value={result.imported.unitTypes} />
                <ResultCard label="Unit Instances" value={result.imported.unitInstances} />
                <ResultCard label="Phase Types" value={result.imported.phaseTypes} />
                <ResultCard label="Phase Instances" value={result.imported.phaseInstances} />
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="border border-destructive/50 bg-destructive/10 p-4">
                  <h4 className="text-sm font-bold text-destructive mb-2">Errors</h4>
                  <ul className="text-xs space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-destructive">• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="border border-yellow-500/50 bg-yellow-500/10 p-4">
                  <h4 className="text-sm font-bold text-yellow-500 mb-2">Warnings</h4>
                  <ul className="text-xs space-y-1">
                    {result.warnings.map((warn, i) => (
                      <li key={i} className="text-yellow-500">• {warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-4">
          {step === "upload" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={files.length === 0}
                className="bg-primary hover:bg-primary/80 text-black font-mono font-bold text-xs uppercase px-6 py-2 border border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import {files.length} Files
              </button>
            </>
          )}

          {step === "complete" && (
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary/80 text-black font-mono font-bold text-xs uppercase px-6 py-2 border border-primary transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 border border-white/10 bg-white/5 text-center">
      <div className="text-xs text-muted-foreground uppercase mb-1">{label}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}
