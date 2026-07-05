import Sidebar from "@/components/Sidebar";

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-transparent text-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}
