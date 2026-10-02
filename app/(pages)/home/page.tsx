import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  CircleCheck,
  CircleDot,
  Clock,
  Ellipsis,
  Lock,
  Monitor,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Config } from "@/app/Config";

type Status = "open" | "progress" | "resolved";

const statusStyles: Record<Status, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-primary/10 text-primary" },
  progress: {
    label: "In progress",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
};

const stats = [
  { label: "Open", value: 2, icon: CircleDot },
  { label: "In progress", value: 1, icon: Clock },
  { label: "Resolved (30 days)", value: 8, icon: CircleCheck },
];

const tickets: { id: number; title: string; when: string; status: Status }[] = [
  { id: 1042, title: "Printer is not printing", when: "Today", status: "open" },
  {
    id: 1038,
    title: "Access to Finance folder",
    when: "2 days ago",
    status: "progress",
  },
  {
    id: 1021,
    title: "New monitor for the office",
    when: "1 week ago",
    status: "resolved",
  },
];

const categories = [
  { key: "hardware", label: "Hardware", icon: Monitor },
  { key: "software", label: "Software", icon: AppWindow },
  { key: "access", label: "Access & passwords", icon: Lock },
  { key: "other", label: "Other", icon: Ellipsis },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 pb-20">
        {/* Hero */}
        <section className="mx-auto flex max-w-2xl flex-col items-center pt-20 pb-14">
          <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {Config.howCanWeHelp}
          </h1>
          <p className="mt-3 text-center text-muted-foreground">
            {Config.findAnswer}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={Config.findAnswerInput}
                className="h-11 rounded-full pl-10"
              />
            </div>
            <Link
              href="/tickets/new"
              className={cn(buttonVariants(), "h-11 rounded-full px-6")}
            >
              {Config.newTicket}
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-3xl font-semibold">{value}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Recent tickets */}
        <section className="mt-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">My recent tickets</h2>
            <Link
              href="/tickets"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <Card className="py-0">
            <ul className="divide-y">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tickets/${t.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        #{t.id} · {t.when}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-0",
                        statusStyles[t.status].className,
                      )}
                    >
                      {statusStyles[t.status].label}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-semibold">
            Quick submit by category
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(({ key, label, icon: Icon }) => (
              <Link key={key} href={`/tickets/new?category=${key}`}>
                <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/50">
                  <CardContent className="flex flex-col gap-3">
                    <Icon className="size-6 text-primary" />
                    <p className="font-medium">{label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
