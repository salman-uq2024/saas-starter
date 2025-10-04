import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";

const seededWorkspaces = [
  { name: "Acme Inc", slug: "acme", plan: "PRO" },
  { name: "Demo Studio", slug: "demo-studio", plan: "FREE" },
];

const seededMembers = [
  { name: "Founding User", email: "founder@example.com", role: "OWNER" },
  { name: "Teammate", email: "teammate@example.com", role: "ADMIN" },
  { name: "Demo User", email: "demo@saas.com", role: "OWNER" },
];

const seededInvites = [
  { email: "newhire@example.com", role: "MEMBER" },
  { email: "demo-invite@saas.com", role: "MEMBER" },
];

export default function DemoPage() {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Demo Overview</h1>
        <p className="text-sm text-slate-500">
          Use this page as a quick reference while recording Loom walkthroughs or hosting live demos. All information matches the
          seeded development database so you can narrate confidently without exposing production data.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>How to access the demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Click <strong>Use demo account</strong> on the login page or request a magic link to any inbox. When SMTP is not
              configured, magic links render in the terminal output for easy copy/paste during a screen share.
            </p>
            <Alert>
              Demo environments never use passwords. The seeded accounts listed below illustrate the data included after running
              <code className="ml-1 rounded bg-slate-900 px-1 py-0.5 text-xs text-white">npm run setup</code>.
            </Alert>
            <Link href="/login" className="inline-flex text-sky-600 hover:underline">
              Go to login →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seeded workspaces</CardTitle>
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
                {seededWorkspaces.map((workspace) => (
                  <TR key={workspace.slug}>
                    <TD>{workspace.name}</TD>
                    <TD>{workspace.slug}</TD>
                    <TD>{workspace.plan}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seeded members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Email</TH>
                  <TH>Role</TH>
                </TR>
              </THead>
              <TBody>
                {seededMembers.map((member) => (
                  <TR key={member.email}>
                    <TD>{member.name}</TD>
                    <TD>{member.email}</TD>
                    <TD>{member.role}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending invite tokens</CardTitle>
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
                {seededInvites.map((invite) => (
                  <TR key={invite.email}>
                    <TD>{invite.email}</TD>
                    <TD>{invite.role}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        {isProduction ? (
          <Alert variant="default">
            This page renders static demo data only. Production deployments should restrict access to real metrics inside the auth
            wall.
          </Alert>
        ) : null}
      </div>
    </section>
  );
}
