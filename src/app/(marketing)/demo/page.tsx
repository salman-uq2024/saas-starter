import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";

export default async function DemoPage() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    take: 3,
  });

  const workspaces = await prisma.workspace.findMany({
    select: { id: true, name: true, slug: true, plan: true },
    take: 2,
  });

  const invites = await prisma.workspaceInvite.findMany({
    where: { status: "PENDING" },
    select: { id: true, email: true, role: true },
    take: 2,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Demo Overview</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Demo Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Use these to log in:</p>
          <ul className="space-y-2">
            <li><strong>demo@saas.com</strong> / password123</li>
            <li><strong>founder@example.com</strong> / password123</li>
            <li><strong>teammate@example.com</strong> / password123</li>
          </ul>
          <Link href="/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Go to Login
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sample Workspaces</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Slug</TH>
                <TH>Plan</TH>
              </TR>
            </THead>
            <TBody>
              {workspaces.map((ws) => (
                <TR key={ws.id}>
                  <TD>{ws.name}</TD>
                  <TD>{ws.slug}</TD>
                  <TD>{ws.plan}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sample Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Email</TH>
              </TR>
            </THead>
            <TBody>
              {users.map((user) => (
                <TR key={user.id}>
                  <TD>{user.name}</TD>
                  <TD>{user.email}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Email</TH>
                <TH>Role</TH>
              </TR>
            </THead>
            <TBody>
              {invites.map((invite) => (
                <TR key={invite.id}>
                  <TD>{invite.email}</TD>
                  <TD>{invite.role}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}