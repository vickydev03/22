import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import toast from "react-hot-toast";
import {
  EllipsisVertical,
  CalendarDays,
  MapPin,
  Tag,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { getUser, getUsers, getWorkshopType } from "@/trpc/type";
import { format } from "date-fns";

export const workshopColumn: ColumnDef<getWorkshopType[number]>[] = [
  {
    accessorKey: "title",
    header: "Workshop",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 py-1 px-1">
          <img
            src={row.original.thumbnail}
            alt={row.original.title}
            className="h-10 w-10 rounded-md object-cover shrink-0 border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-sm truncate">
              {row.original.title}
            </p>

            <div className="text-xs line-clamp-1 text-muted-foreground truncate max-w-[180px]">
              <div dangerouslySetInnerHTML={{__html:row.original.description}}/>
            </div>
            
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className="font-mono font-semibold text-sm gap-1"
        >
          <Tag className="size-3" />₹{row.original.price.toFixed(2)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "eventDate",
    header: "Event Date",
    cell: ({ row }) => {
      const formatted = format(
        new Date(row.original.eventDate),
        "do MMM yyyy",
      ).toUpperCase();
      return (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <CalendarDays className="size-4 text-muted-foreground shrink-0" />
          <span>{formatted}</span>
        </div>
      );
    },
  },
  {
  accessorKey: "time-until",
  header: "Time Until Event",
  cell: ({ row }) => {
    const eventDate = new Date(row.original.eventDate);
    const past = isPast(eventDate);
    const distance = formatDistanceToNow(eventDate, { addSuffix: true });

    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
            past
              ? "bg-red-100 text-red-500"
              : "bg-green-100 text-green-600"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              past ? "bg-red-400" : "bg-green-500 animate-pulse"
            }`}
          />
          {distance}
        </span>
      </div>
    );
  },
},
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="size-4 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs text-muted-foreground truncate max-w-[100px]">
            {row.original.location?.city}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MMM d, yyyy");
      return <p className="text-xs text-muted-foreground">{formatted}</p>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: wire up delete mutation
      };

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-1 hover:bg-muted transition-colors"
          >
            <EllipsisVertical className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Manage Workshop</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
