import { WarningAlt } from "@carbon/icons-react";

interface ComplianceBannerProps {
  sideNavExpanded: boolean;
}

export function ComplianceBanner({ sideNavExpanded }: ComplianceBannerProps) {
  return (
    <footer className={`fixed bottom-0 right-0 left-0 h-8 border-t bg-card flex items-center justify-center gap-2 text-[11px] text-muted-foreground shrink-0 px-4 z-30 transition-all duration-200 ${sideNavExpanded ? "ml-64" : "ml-0"}`}>
      <WarningAlt size={12} />
      <span>For informational purposes only. Not investment advice. AI-generated content may contain errors. SEBI-compliant disclosures apply.</span>
    </footer>
  );
}
