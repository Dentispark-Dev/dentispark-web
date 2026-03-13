import Header from "@/src/components/layouts/header";
import { Footer } from "@/src/components/layouts/footer";

export default function ScholarshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
