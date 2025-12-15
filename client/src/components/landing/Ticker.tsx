import { motion } from "framer-motion";

export function Ticker() {
  const words = [
    "DECENTRALIZED FIELD GATEWAYS", "TAMPER-EVIDENT EVENT LOGS", "SIGNED SETPOINT CHANGES", 
    "CRYPTOGRAPHIC PROOF OF MAINTENANCE", "ZERO-TRUST REMOTE ACCESS", "SAFETY-FIRST, AUDIT-READY", 
    "NEO N3 + ETH L2 HYBRID FABRIC", "ZK-ATTESTED COMPLIANCE"
  ];

  return (
    <div className="bg-primary overflow-hidden py-3 border-y border-black">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 10 
        }}
      >
        {[...words, ...words, ...words].map((word, i) => (
          <div key={i} className="flex items-center mx-4">
            <span className="text-black font-heading font-black text-2xl uppercase tracking-tight">
              {word}
            </span>
            <span className="ml-8 text-black font-mono font-bold">///</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
