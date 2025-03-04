import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import useApi from "@/hooks/useApi";
import { deleteLanguage, fetchAllLanguages } from "@/lib/services";
import { useEffect, useState } from "react";

export interface Language {
  _id: string;
  title: string;
  key: string;
  isDefault: boolean;
  isRtl: boolean;
}

type Props = {
  refresh: boolean;
  setRefresh: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectLanguage: (language: Language) => void;
  showUpdateDialog: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export const LanguagesTable = ({
  refresh,
  setRefresh,
  selectLanguage,
  showUpdateDialog,
}: Props) => {
  const { data, execute } = useApi(fetchAllLanguages);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    execute();
  }, [execute, refresh]);

  useEffect(() => {
    if (data) {
      setLanguages(data.data);
    }
  }, [data, refresh]);

  console.log({ data });

  const handleDelete = async (id: string) => {
    deleteLanguage(id);
    setRefresh((prev: boolean) => !prev);
  };

  return (
    <Table>
      {/* <TableCaption>A list of available languages.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Language Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>RTL</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {languages.map((language: Language) => (
          <TableRow key={language._id}>
            <TableCell>{language.title}</TableCell>
            <TableCell>{language.key}</TableCell>
            <TableCell>
              {language.isDefault && <Badge variant="default">Default</Badge>}
            </TableCell>
            <TableCell>
              {language.isRtl ? <Badge variant="secondary">RTL</Badge> : "-"}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      showUpdateDialog(true);
                      selectLanguage(language);
                    }}
                  >
                    Edit Language
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Edit Language</DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => handleDelete(language._id)}
                    className="text-destructive"
                  >
                    Delete Language
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
