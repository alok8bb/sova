import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4">
      <Sidebar />
      <div className="ml-64 px-4">{children}</div>
    </div>
  );
}
