"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?login=true");
  }, [router]);

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center text-mute font-mono text-xs">
      <div className="animate-pulse">Redirecting to secure auth portal…</div>
    </main>
  );
}
