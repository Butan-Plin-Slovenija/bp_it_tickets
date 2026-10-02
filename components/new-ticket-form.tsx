"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "access", label: "Access & passwords" },
  { value: "other", label: "Other" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function NewTicketForm({
  defaultCategory,
}: {
  defaultCategory?: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(
    categories.some((c) => c.value === defaultCategory) ? defaultCategory! : "",
  );
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
  }>({});

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next: typeof errors = {};
    if (title.trim().length < 3)
      next.title = "Enter a short title (min. 3 characters).";
    if (!category) next.category = "Choose a category.";
    if (description.trim().length < 10)
      next.description = "Describe the problem (min. 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    // TODO: save to Supabase (insert ticket, upload files to Storage)
    console.log({ title, category, priority, description, files });
    router.push("/");
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <form onSubmit={onSubmit} noValidate>
        <CardHeader>
          <CardTitle className="text-xl">New ticket</CardTitle>
          <CardDescription>
            Describe the problem and we will get back to you as soon as
            possible.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 flex flex-col gap-5">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Printer is not printing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v ?? "")}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label>Priority</Label>
            <div
              className="grid grid-cols-3 gap-2"
              role="group"
              aria-label="Priority"
            >
              {priorities.map((p) => {
                const active = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      "h-9 rounded-full border text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="What happened and when did it start?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Attachments */}
          <div className="grid gap-2">
            <Label>Attachments</Label>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="flex flex-col items-center gap-1 rounded-lg border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/50"
            >
              <Upload className="size-5" />
              Drop a screenshot or file here, or click to browse
            </button>

            {files.length > 0 && (
              <ul className="grid gap-2">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, k) => k !== i))
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-6 justify-end gap-2 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-5"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full px-6"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit ticket"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
