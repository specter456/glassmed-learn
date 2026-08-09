import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { GlassMedLogo } from "@/components/GlassMedLogo";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen flex-col"
    >
      <GlassBackdrop />

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-strong w-full rounded-3xl p-10"
          >
            <p className="text-6xl font-extrabold tracking-tight text-wistaria">404</p>
            <div className="mt-4 flex justify-center">
              <GlassMedLogo size="md" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              This page slipped out of the anatomy atlas. Let's get you back to
              studying.
            </p>
            <Button onClick={() => navigate("/")} className="mt-6 gap-2">
              <ArrowLeft className="size-4" />
              Back home
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
