import { Navbar } from "@/components/layout/Navbar";
import { MOCK_EVENTS, MOCK_ASSETS } from "@/data/mockData";
import { FileText, ExternalLink, Filter } from "lucide-react";

export default function Events() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold uppercase">Audit Log</h1>
            <p className="text-muted-foreground text-sm">Immutable Ledger // Anchored on Ethereum Sepolia</p>
          </div>
          <button className="flex items-center gap-2 border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors text-sm uppercase">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black text-muted-foreground border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Recorded By</th>
                <th className="px-6 py-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_EVENTS.map(evt => {
                const asset = MOCK_ASSETS.find(a => a.id === evt.assetId);
                return (
                  <tr key={evt.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border ${
                        evt.eventType.includes('TRIP') ? 'border-destructive text-destructive bg-destructive/10' : 
                        evt.eventType.includes('CHANGE') ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                        'border-primary text-primary bg-primary/10'
                      }`}>
                        {evt.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {asset?.nameOrTag || evt.assetId}
                      <div className="text-xs text-muted-foreground font-normal">{evt.assetId}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={evt.details}>
                      {evt.details}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {evt.recordedBy}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <a href={`https://sepolia.etherscan.io/tx/${evt.txHash}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline text-xs font-bold uppercase">
                          {evt.txHash.slice(0, 8)}... <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          Hash: {evt.payloadHash.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 border-t border-white/10 bg-black/20 text-center text-xs text-muted-foreground uppercase">
            End of Log // {MOCK_EVENTS.length} Records Found
          </div>
        </div>
      </div>
    </div>
  );
}
