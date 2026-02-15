import { AlertTriangle } from "lucide-react";

export function ComplianceBanner() {
  return (
    <footer className="h-8 border-t bg-card flex items-center justify-center gap-2 text-[11px] text-muted-foreground shrink-0 px-4">
      <AlertTriangle className="h-3 w-3" />
      <span>For informational purposes only. Not investment advice. AI-generated content may contain errors. SEBI-compliant disclosures apply.</span>
    </footer>
  );
}
