"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { DataTable } from '@/components/languages/data-table';
import { columns } from "@/components/languages/columns";
import { AddLanguageDialog } from "@/components/languages/add-language-dialog";
import { LanguagesTable } from "@/components/languages/languages-table";

export default function LanguagesPage() {
  const [open, setOpen] = useState(false);
  // state to refresh component manually
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Languages</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Language
        </Button>
      </div>
      <LanguagesTable setRefresh={setRefresh} refresh={refresh} />
      <AddLanguageDialog
        open={open}
        onOpenChange={setOpen}
        setRefresh={setRefresh}
      />
    </div>
  );
}
