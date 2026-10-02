import { Navbar } from "@/components/navbar";
import { NewTicketForm } from "@/components/new-ticket-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <NewTicketForm defaultCategory={category} />
      </main>
    </>
  );
}
