import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  EllipsisVertical,
  MapPin,
  CalendarDays,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  IndianRupee,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getClasses } from "@/trpc/type";


export const regularClassColumns: ColumnDef<getClasses>[] = [
  // 🖼️ Thumbnail + Title
  {
    accessorKey: "title",
    header: "Class",
    cell: ({ row }) => {
      const { title, description, thumbnail, id } = row.original;
      return (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={thumbnail}
            alt={title}
            className="size-10 rounded-md object-cover shrink-0 border border-border"
          />
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-sm truncate max-w-[180px]">{title}</p>
            <div className="text-xs line-clamp-1 text-muted-foreground font-normal truncate max-w-[180px]">
              <div dangerouslySetInnerHTML={{__html:description}}/>
            </div>
          </div>
        </div>
      );
    },
  },

  // 📍 City
  {
    accessorKey: "City",
    header: "City",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="size-4 text-muted-foreground shrink-0" />
        <span className="truncate">{row.original.City}</span>
      </div>
    ),
  },

  // 💰 Price
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm font-medium">
        <IndianRupee className="size-4 text-muted-foreground" />
        <span>{row.original.price.toFixed(2)}</span>
      </div>
    ),
  },

  // ✅ Status
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive =new Date() < new Date(row.original.endDate)
      return isActive ? (
        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs gap-1 font-medium">
          <ToggleRight className="size-3" />
          Active
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs gap-1 font-medium">
          <ToggleLeft className="size-3" />
          Inactive
        </Badge>
      );
    },
  },

  

  // 📅 Start → End Date
  {
    accessorKey: "startDate",
    header: "Duration",
    cell: ({ row }) => {
      const start = format(new Date(row.original.startDate), "MMM d, yyyy");
      const end = format(new Date(row.original.endDate), "MMM d, yyyy");
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <CalendarDays className="size-4 shrink-0" />
          <span>{start}</span>
          <span className="text-border">→</span>
          <span>{end}</span>
        </div>
      );
    },
  },

  // ⚙️ Actions
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="rounded-md p-1 hover:bg-muted transition-colors"
        >
          <EllipsisVertical className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage Class</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/classes/${row.original.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit Class</DropdownMenuItem>
          <DropdownMenuItem>
            {row.original.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete Class
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];