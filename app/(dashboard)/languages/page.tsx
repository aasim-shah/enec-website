"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { DataTable } from '@/components/languages/data-table';
import { columns } from "@/components/languages/columns";
import { AddLanguageDialog } from "@/components/languages/add-language-dialog";
import { LanguagesTable } from "@/components/languages/languages-table";
import { UpdateLanguageDialog } from "@/components/languages/edit-language-dialogue";
import { Language } from "@/components/languages/languages-table"; // Ensure you import the Language type

export default function LanguagesPage() {
  const [open, setOpen] = useState(false);
  // state to refresh component manually
  const [updateLanguage, setUpdateLanguage] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
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
      <LanguagesTable
        setRefresh={setRefresh}
        showUpdateDialog={setUpdateLanguage}
        refresh={refresh}
        selectLanguage={setSelectedLanguage}
      />
      <AddLanguageDialog
        open={open}
        onOpenChange={setOpen}
        setRefresh={setRefresh}
      />
      <UpdateLanguageDialog
        open={Boolean(updateLanguage)}
        onOpenChange={setUpdateLanguage}
        language={selectedLanguage}
        setRefresh={setRefresh}
      />
    </div>
  );
}
