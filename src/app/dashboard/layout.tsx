import type { Metadata } from "next";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import DoodleBackground from "@/components/custom/DoodleBackground";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default function DashboardLayout({
  children,
}: React.PropsWithChildren<object>) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[95svh] pb-10 gap-16 p-6 pt-8 font-[family-name:var(--font-geist-sans)] relative">
      <DoodleBackground />
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {children}
      </main>
      <Footer />
    </div>
  );
}
