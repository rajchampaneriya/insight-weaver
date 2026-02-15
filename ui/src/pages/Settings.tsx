import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configuration and compliance information</p>
      </div>

      {/* Theme */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold mb-2">Appearance</h2>
          <p className="text-xs text-muted-foreground">
            Theme is controlled via the sun/moon toggle in the header. Dark mode is default for the trading terminal experience.
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">About Idea Factory</h2>
            <Badge variant="outline" className="text-[10px] font-mono">Pilot #001</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Idea Factory is a sanctioned innovation experiment designed to prove that an AI insight layer
            can be built rapidly using existing Azure credits and sandbox environments. The goal is to reduce
            "idea-to-prototype" time from 6 weeks to 2 weeks while maintaining governance readiness.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is an "Information Tool," not an "Advisory Engine." It aggregates publicly available data
            about NSE/BSE equities into a single adaptive insight surface, reducing manual research time
            by up to 90%.
          </p>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card className="border-carbon-warning/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-carbon-warning" />
            <h2 className="text-sm font-semibold">Compliance & Disclaimer</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-1 text-carbon-warning shrink-0" />
              <span>This product does not generate explicit trading recommendations. It is designed to avoid SEBI Investment Advisor regulations.</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-1 text-carbon-warning shrink-0" />
              <span>All AI-generated content is clearly labelled and includes audit trail metadata for governance compliance.</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-1 text-carbon-warning shrink-0" />
              <span>Data sources are limited to publicly available information. This experiment operates within controlled resource and data boundaries.</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-1 text-carbon-warning shrink-0" />
              <span>Phase 1 scope covers cash equities on NSE and BSE only. Derivatives are out of scope.</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Responsible AI */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Responsible AI Principles</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
            <li>Every AI-generated section includes "AI-Generated • Not Financial Advice" labelling</li>
            <li>Audit trails log model version, timestamp, and data sources for all generated content</li>
            <li>Risk disclosures are prominently displayed on all insight surfaces</li>
            <li>No prescriptive buy/sell calls — information only</li>
            <li>Aligned with Microsoft Responsible AI guidelines and SEBI expectations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
