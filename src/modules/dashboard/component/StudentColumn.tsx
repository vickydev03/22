import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  EllipsisVertical,
  Mail,
  Phone,
  User,
  CalendarDays,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getStudent } from "@/trpc/type";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const studentsColumn: ColumnDef<getStudent>[] = [
  // 👤 Student Info
  {
    accessorKey: "user",
    header: "Student",
    cell: ({ row }) => {
      const user = row.original.user;

      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col px-2 min-w-0">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              ID: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      );
    },
  },

  // 📧 Email
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Mail className="size-4 text-muted-foreground" />
        <span className="truncate max-w-[180px]">
          {row.original.user.email || "N/A"}
        </span>
      </div>
    ),
  },

  // 📞 Phone
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Phone className="size-4 text-muted-foreground" />
        <span>{row.original.user.phone}</span>
      </div>
    ),
  },

  // 🎭 Role
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user.role;

      return (
        <Badge variant={"secondary"} className="text-xs">
          {role}
        </Badge>
      );
    },
  },

  // 📅 Enrolled On
  {
    accessorKey: "createdAt",
    header: "Enrolled",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MMM d, yyyy");

      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-4" />
          {formatted}
        </div>
      );
    },
  },

  // ⚙️ Actions
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // const router=useRouter
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-1 hover:bg-muted transition-colors"
          >
            <EllipsisVertical className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Manage Student</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/users/${row.original.user.id}`}>
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Remove From Workshop
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
