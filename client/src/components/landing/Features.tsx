import { Router, Anchor, Fingerprint, ClipboardCheck, Globe, Search } from "lucide-react";

const features = [
  {
    icon: Router,
    title: "Field Gateways",
    desc: "Industrial edge clients speaking Modbus, DNP3, CIP, IEC 61850. TLS + key management built in."
  },
  {
    icon: Anchor,
    title: "Event Anchors",
    desc: "Bundle safety events, breaker operations, and setpoint changes. Hash and anchor to chain for audit-proof history."
  },
  {
    icon: Fingerprint,
    title: "Identity & Access",
    desc: "On-chain roles for technicians, engineers, and auditors. Hardware key support. Session-level access proofs."
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Engine",
    desc: "Model NFPA 70B programs and maintenance schedules as smart contracts. Track status across multi-site portfolios."
  },
  {
    icon: Globe,
    title: "DePIN Mesh",
    desc: "Distributed infra nodes across multiple regions and providers. Auto-failover routing for SCADA backhauls."
  },
  {
    icon: Search,
    title: "Analytics & Forensics",
    desc: "Query operations over time. Correlate events with maintenance and configuration changes. Export to existing historians."
  }
];

export function Features() {
  return (
    <div className="py-24 bg-background relative" id="features">
      <div className="container mx-auto px-6">
        <div className="mb-16 border-b border-white/20 pb-4 flex justify-between items-end">
          <h2 className="text-4xl md:text-6xl font-heading uppercase text-white">
            System<br/><span className="text-primary">Capabilities</span>
          </h2>
          <span className="font-mono text-muted-foreground hidden md:block">
            // INDEX: 070B<br/>
            // STATUS: ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group border-r border-b border-white/10 p-8 hover:bg-white/5 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground opacity-50">
                0{i + 1}
              </div>
              
              <div className="mb-6 p-3 bg-white/5 w-fit border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <feature.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-2xl font-heading uppercase mb-3 text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>

              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
