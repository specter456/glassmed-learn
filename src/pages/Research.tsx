import { Search } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { AUDIO_3D_FEATURES } from "@/lib/medipro";

export default function Research() {
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Research" />
      <ComingSoon
        icon={Search}
        title="The Library"
        tagline="From foundations to frontiers"
        description="A growing archive of 3D anatomical models and narrated deep-dives that connect each basics topic to current clinical science."
        features={AUDIO_3D_FEATURES}
        accent="#6fb5b0"
      />
    </div>
  );
}
