import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import BoardClient from "./BoardClient";

export default async function BoardPage() {
  if (!requireAdmin(cookies())) {
    redirect("/admin/login");
  }
  return <BoardClient />;
}
