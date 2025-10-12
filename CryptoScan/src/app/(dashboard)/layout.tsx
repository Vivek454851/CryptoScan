import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
import DashboardLayout from "@/components/DashboardLayout";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
