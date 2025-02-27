'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export type Language = {
  id: string;
  title: string;
  key: string;
  isDefault: boolean;
  isRtl: boolean;
};

export const columns: ColumnDef<Language>[] = [
  {
    accessorKey: 'title',
    header: 'Language Name',
  },
  {
    accessorKey: 'key',
    header: 'Key',
  },
  {
    accessorKey: 'isDefault',
    header: 'Default',
    cell: ({ row }) => {
      const isDefault = row.getValue('isDefault') as boolean;
      return isDefault ? (
        <Badge variant="default">Default</Badge>
      ) : null;
    },
  },
  {
    accessorKey: 'isRtl',
    header: 'RTL',
    cell: ({ row }) => {
      const isRtl = row.getValue('isRtl') as boolean;
      return isRtl ? (
        <Badge variant="secondary">RTL</Badge>
      ) : null;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const language = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(language.id)}>
              Copy language ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit language</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete language
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];