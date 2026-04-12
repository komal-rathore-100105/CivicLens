import { useEffect, useMemo, useState } from "react";
import { Download, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { anchorCertificate } from "@/lib/campaignStore";

export default function Certificates() {
  const [contentHash, setContentHash] = useState("Calculating...");
  const [anchorId, setAnchorId] = useState("Pending");

  const certificate = useMemo(() => {
    return {
      id: `CIV-${Date.now().toString().slice(-8)}`,
      user: "Priya Sharma",
      campaign: "Mithi River Plastic Recovery",
      verifiedImpact: "1,240 kg CO2 equivalent",
      confidence: "93%",
      issuedDate: new Date().toLocaleDateString(),
    };
  }, []);

  useEffect(() => {
    const generateHash = async () => {
      const payload = [
        certificate.id,
        certificate.user,
        certificate.campaign,
        certificate.verifiedImpact,
        certificate.confidence,
        certificate.issuedDate,
      ].join("|");

      const encoded = new TextEncoder().encode(payload);
      const digest = await crypto.subtle.digest("SHA-256", encoded);
      const digestArray = Array.from(new Uint8Array(digest));
      const hash = digestArray.map((value) => value.toString(16).padStart(2, "0")).join("");

      setContentHash(hash);

      const anchorResult = await anchorCertificate({
        certificateId: certificate.id,
        recipientName: certificate.user,
        missionTitle: certificate.campaign,
        contentHash: hash,
      });

      setAnchorId(anchorResult.chainReference);
    };

    generateHash().catch(() => {
      setContentHash("Unavailable");
      setAnchorId("Anchor failed");
    });
  }, [certificate]);

  const downloadCertificate = () => {
    const payload = [
      "Digital Impact Certificate",
      `Certificate ID: ${certificate.id}`,
      `Recipient: ${certificate.user}`,
      `Campaign: ${certificate.campaign}`,
      `Verified Impact: ${certificate.verifiedImpact}`,
      `AI Confidence: ${certificate.confidence}`,
      `Issued Date: ${certificate.issuedDate}`,
      `Blockchain Anchor ID: ${anchorId}`,
      `Blockchain Content Hash: ${contentHash}`,
    ].join("\n");

    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${certificate.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sharePreview = async () => {
    const shareText = `${certificate.user} earned a verified climate impact certificate on ActiVise (${certificate.verifiedImpact}).`;
    if (navigator.share) {
      await navigator.share({
        title: "Digital Impact Certificate",
        text: shareText,
      });
      return;
    }
    await navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Certification System</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Certificate content is anchored to blockchain hash records for immutable proof.
        </p>
      </div>

      <section className="rounded-2xl border border-primary/25 bg-card p-6 glow-primary">
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <div className="flex items-center gap-2 text-primary mb-3">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-heading">Digital Impact Certificate</p>
          </div>
          <p className="text-xl font-heading text-foreground">{certificate.user}</p>
          <p className="text-sm text-muted-foreground mt-1">is recognized for verified contribution to</p>
          <p className="text-base font-medium text-foreground mt-1">{certificate.campaign}</p>

          <div className="mt-4 grid md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-background/70 p-3">
              <p className="text-[11px] text-muted-foreground">Certificate ID</p>
              <p className="text-sm font-medium text-foreground">{certificate.id}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 p-3">
              <p className="text-[11px] text-muted-foreground">Verified impact</p>
              <p className="text-sm font-medium text-foreground">{certificate.verifiedImpact}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 p-3">
              <p className="text-[11px] text-muted-foreground">Confidence score</p>
              <p className="text-sm font-medium text-foreground">{certificate.confidence}</p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <p className="text-[11px] text-muted-foreground">Blockchain anchor</p>
            <p className="text-sm font-medium text-foreground">{anchorId}</p>
            <p className="text-[11px] text-muted-foreground mt-1 break-all">{contentHash}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={downloadCertificate} className="gap-2">
            <Download className="h-4 w-4" /> Download Certificate
          </Button>
          <Button onClick={sharePreview} variant="secondary" className="gap-2">
            <Share2 className="h-4 w-4" /> Share Preview
          </Button>
        </div>
      </section>
    </div>
  );
}
