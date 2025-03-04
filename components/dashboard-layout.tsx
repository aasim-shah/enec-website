import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "./theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 h-full mx-4 md:mx-8">
        <div className="py-3 border-b mb-5 flex justify-between items-center">
          <SidebarTrigger />
          <ThemeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
