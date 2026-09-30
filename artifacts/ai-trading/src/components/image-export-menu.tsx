import { ChevronDown, Copy, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ImageExportMenuProps {
  label: string;
  copyLabel: string;
  downloadLabel: string;
  onCopy: () => void;
  onDownload: () => void;
  disabled?: boolean;
  triggerTestId: string;
  copyTestId: string;
  downloadTestId: string;
}

export function ImageExportMenu({
  label, copyLabel, downloadLabel, onCopy, onDownload, disabled,
  triggerTestId, copyTestId, downloadTestId,
}: ImageExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="h-9 gap-1.5 text-xs" disabled={disabled} data-testid={triggerTestId}>
          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuItem onSelect={onCopy} data-testid={copyTestId} className="min-h-10">
          <Copy aria-hidden="true" />
          {copyLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDownload} data-testid={downloadTestId} className="min-h-10">
          <Download aria-hidden="true" />
          {downloadLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}