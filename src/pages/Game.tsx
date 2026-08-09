import { Scissors } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { AUDIO_3D_FEATURES } from "@/lib/medipro";

export default function Game() {
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Game" />
      <ComingSoon
        icon={Scissors}
        title="The OR"
        tagline="Quick-fire rounds where every second counts"
        description="Speed rounds, timed recalls and score streaks built on the same card bank. Perfect for the bus ride before an exam."
        features={AUDIO_3D_FEATURES}
        accent="#e896b4"
      />
    </div>
  );
}
