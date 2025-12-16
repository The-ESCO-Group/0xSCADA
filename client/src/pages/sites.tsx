import { Navbar } from "@/components/layout/Navbar";
import { MOCK_SITES, MOCK_ASSETS } from "@/data/mockData";
import { Search, MapPin, Zap, AlertCircle, CheckCircle } from "lucide-react";

export default function Sites() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold uppercase">Network Assets</h1>
            <p className="text-muted-foreground text-sm">Registry // Sites & Equipment</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search ID, Tag, or Location..." 
                className="w-full bg-white/5 border border-white/20 pl-10 pr-4 py-2 text-sm focus:border-primary outline-none transition-colors"
              />
            </div>
            <button className="bg-primary text-black font-bold uppercase px-4 py-2 text-sm hover:bg-primary/80 transition-colors">
              + Register
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {MOCK_SITES.map(site => (
            <div key={site.id} className="border border-white/10 bg-white/5">
              <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${site.status === 'ONLINE' ? 'bg-primary' : 'bg-yellow-500'} animate-pulse`} />
                  <div>
                    <h2 className="text-lg font-bold uppercase">{site.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {site.location}
                      <span className="mx-2">|</span>
                      ID: {site.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-bold font-mono">{site.owner}</span>
                  </div>
                  <button className="border border-white/20 px-3 py-1 hover:bg-white/10 transition-colors uppercase">
                    Details
                  </button>
                </div>
              </div>

              {/* Assets List */}
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Asset Tag</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Criticality</th>
                      <th className="px-6 py-3">Metadata</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ASSETS.filter(a => a.siteId === site.id).map(asset => (
                      <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold font-mono">{asset.nameOrTag}</td>
                        <td className="px-6 py-4">{asset.assetType}</td>
                        <td className="px-6 py-4">
                          {asset.critical ? (
                            <span className="text-destructive flex items-center gap-1 font-bold text-xs uppercase border border-destructive/30 bg-destructive/10 px-2 py-1 w-fit">
                              <Zap className="w-3 h-3" /> Critical
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs uppercase px-2 py-1">Standard</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                          {JSON.stringify(asset.metadata).slice(0, 30)}...
                        </td>
                        <td className="px-6 py-4">
                           {asset.status === 'OK' && <span className="text-primary flex items-center gap-1"><CheckCircle className="w-3 h-3"/> OK</span>}
                           {asset.status === 'WARNING' && <span className="text-yellow-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> WARN</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary hover:underline text-xs uppercase font-bold">
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                    {MOCK_ASSETS.filter(a => a.siteId === site.id).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                          No assets registered at this site.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
