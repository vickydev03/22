"use client";

import React, { Suspense, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client"; // adjust to your path
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Icons
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GripVertical,
  IndianRupee,
  Layers,
  Loader2,
  Plus,
  SendHorizontalIcon,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";

// shadcn/ui
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "../component/TiptapEditor";
import { ThumbnailUploader } from "./RegistrationsView";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const videoEntrySchema = z.object({
  videoKey: z.string().min(1, "Select a video file"),
  title: z
    .string()
    .min(1, "Video title is required")
    .max(120, "Max 120 characters"),
});

const createTutorialSchema = z.object({
  title: z
    .string()
    .min(3, "At least 3 characters")
    .max(120, "Max 120 characters"),
  description: z
    .string()
    .min(10, "Write at least 10 characters")
    .max(2000, "Max 2000 characters"),
  thumbnail: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Thumbnail is required"),
  price: z
    .number()
    .int("Whole number only")
    .nonnegative("Cannot be negative"),
  duration: z
    .number()
    .int("Whole number only")
    .positive("Must be greater than 0")
    .optional(),
  videos: z.array(videoEntrySchema).min(1, "Add at least one video"),
});

type CreateTutorialFormValues = z.infer<typeof createTutorialSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoItem {
  key: string;
  size: number;
  lastModified: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const fieldInput =
  "h-11 rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-400 transition-all shadow-sm";

function SectionTitle({
  step,
  label,
  subtitle,
}: {
  step: number;
  label: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-6 mb-6 border-b border-neutral-100">
      <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <h2 className="text-lg font-black text-neutral-900 tracking-tight">
          {label}
        </h2>
        <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Details", sub: "Title & description" },
  { label: "Media", sub: "Thumbnail & pricing" },
  { label: "Videos", sub: "Attach video lessons" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-1 py-2 h-full">
      {STEPS.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
            i === current
              ? "bg-neutral-800"
              : i < current
              ? "opacity-70"
              : "opacity-40"
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
              i < current
                ? "bg-emerald-500 text-white"
                : i === current
                ? "bg-white text-neutral-900"
                : "bg-neutral-700 text-neutral-400"
            )}
          >
            {i < current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-bold leading-none",
                i === current ? "text-white" : "text-neutral-400"
              )}
            >
              {s.label}
            </p>
            <p
              className={cn(
                "text-[10px] mt-0.5",
                i === current ? "text-neutral-400" : "text-neutral-600"
              )}
            >
              {s.sub}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-auto pt-8">
        <div className="rounded-xl bg-neutral-800/50 border border-neutral-700/50 p-4">
          <Sparkles className="w-4 h-4 text-amber-400 mb-2" />
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Complete all three steps to publish your tutorial to the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Video Row ────────────────────────────────────────────────────────────────

function VideoRow({
  index,
  availableVideos,
  isBusy,
  canRemove,
  onRemove,
  form,
}: {
  index: number;
  availableVideos: VideoItem[];
  isBusy: boolean;
  canRemove: boolean;
  onRemove: (i: number) => void;
  form: ReturnType<typeof useForm<CreateTutorialFormValues>>;
}) {
  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50">
      {/* Row header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-neutral-300" />
          <Badge
            variant="secondary"
            className="rounded-md bg-white text-xs font-semibold text-neutral-500 shadow-sm border border-neutral-200"
          >
            Lesson {index + 1}
          </Badge>
        </div>
        {canRemove && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onRemove(index)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Video file select */}
        <FormField
          control={form.control}
          name={`videos.${index}.videoKey`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-neutral-600">
                Video File <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                disabled={isBusy || availableVideos.length === 0}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-10 rounded-xl border-neutral-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-neutral-900/10 data-[placeholder]:text-neutral-400 transition-all">
                    <SelectValue
                      placeholder={
                        availableVideos.length === 0
                          ? "No videos uploaded yet"
                          : "Select a file…"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-2xl border-neutral-200 shadow-xl max-h-64">
                  {availableVideos.map((v) => (
                    <SelectItem
                      key={v.key}
                      value={v.key}
                      className="rounded-xl cursor-pointer py-2.5 focus:bg-neutral-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <Video className="w-3.5 h-3.5 text-neutral-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 truncate max-w-[180px]">
                            {v.key}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {formatBytes(v.size)}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Lesson title */}
        <FormField
          control={form.control}
          name={`videos.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-neutral-600">
                Lesson Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Introduction to TypeScript"
                  disabled={isBusy}
                  className="h-10 rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-400 shadow-sm transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function TutorialFormInner() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tutorials.getVideos.queryOptions());
  const availableVideos: VideoItem[] = data?.videos ?? [];

  const [step, setStep] = useState(0);

  const form = useForm<CreateTutorialFormValues>({
    resolver: zodResolver(createTutorialSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      price:0,
      duration:0,
      videos: [{ videoKey: "", title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
  });

  // Replace with your actual tRPC mutation
  const createMutation = useMutation(
    trpc.tutorials.createTutorials.mutationOptions({
      onSuccess: () => {
        toast.success("Tutorial created!");
        form.reset();
        setStep(0);
      },
      onError: () => {
        toast.error("Something went wrong.");
      },
    })
  );

  const isBusy = form.formState.isSubmitting || createMutation.isPending;

  const stepFields: (keyof CreateTutorialFormValues)[][] = [
    ["title", "description"],
    ["thumbnail", "price", "duration"],
    ["videos"],
  ];

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step] as (keyof CreateTutorialFormValues)[]);
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (values: CreateTutorialFormValues) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
      <header className="h-14 bg-neutral-900 flex items-center px-6 gap-3">
        <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-neutral-900" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">
          Tutorial Studio
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-sm text-neutral-400">New Tutorial</span>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-52 flex-shrink-0 flex-col">
          <div className="bg-neutral-900 rounded-2xl p-3 sticky top-10">
            <Sidebar current={step} />
          </div>
        </aside>

        {/* Form card */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="p-8">

                  {/* ── Step 0: Details ── */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <SectionTitle
                        step={1}
                        label="Tutorial Details"
                        subtitle="Give your tutorial a clear title and an engaging description."
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-800">
                              Title <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Complete TypeScript Mastery"
                                className={fieldInput}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField control={form.control} name="description" render={({ field }) => (
                                              <FormItem>
                                                <FormLabel><Label>Description</Label></FormLabel>
                                                <FormControl>
                                                  <TiptapEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={form.formState.errors.description?.message}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )} />
                    </div>
                  )}

                  {/* ── Step 1: Media ── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <SectionTitle
                        step={2}
                        label="Media & Pricing"
                        subtitle="Set the cover image URL, price, and total duration."
                      />

                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-800">
                             Image
                            </FormLabel>
                            <FormControl>
                              <ThumbnailUploader value={field.value} onChange={field.onChange} />
                            </FormControl>
                            {/* {field.value && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-neutral-200 aspect-video w-full max-w-sm">
                                <img
                                  src={field.value}
                                  alt="Thumbnail preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) =>
                                    ((e.target as HTMLImageElement).style.display = "none")
                                  }
                                />
                              </div>
                            )} */}
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-neutral-800">
                                Price{" "}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                    <IndianRupee className="w-4 h-4 text-neutral-400" />
                                  </div>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="2999"
                                    className={cn(fieldInput, "pl-14")}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : parseInt(e.target.value, 10)
                                      )
                                    }
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-neutral-400 mt-1">
                                In cents — 2999 = $29.99. Blank = free.
                              </p>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-neutral-800">
                                Duration{" "}
                                <span className="text-xs font-normal text-neutral-400">
                                  optional
                                </span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-neutral-400" />
                                  </div>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="3600"
                                    className={cn(fieldInput, "pl-14")}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : parseInt(e.target.value, 10)
                                      )
                                    }
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-neutral-400 mt-1">
                                Total length in seconds.
                              </p>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Step 2: Videos ── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <SectionTitle
                        step={3}
                        label="Video Lessons"
                        subtitle="Attach one or more uploaded videos and give each lesson a title."
                      />

                      {/* Stats badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200">
                          <Layers className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-xs font-semibold text-neutral-600">
                            {availableVideos.length} file
                            {availableVideos.length !== 1 ? "s" : ""} in storage
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                          <Video className="w-3.5 h-3.5 text-neutral-300" />
                          <span className="text-xs font-semibold text-white">
                            {fields.length} lesson
                            {fields.length !== 1 ? "s" : ""} added
                          </span>
                        </div>
                      </div>

                      {/* Video rows */}
                      <div className="space-y-3">
                        {fields.map((f, i) => (
                          <VideoRow
                            key={f.id}
                            index={i}
                            availableVideos={availableVideos}
                            isBusy={isBusy}
                            canRemove={fields.length > 1}
                            onRemove={remove}
                            form={form}
                          />
                        ))}
                      </div>

                      {/* Array-level error */}
                      {typeof (form.formState.errors.videos as { message?: string })?.message === "string" && (
                        <p className="text-xs text-red-500">
                          {(form.formState.errors.videos as { message?: string }).message}
                        </p>
                      )}

                      {/* Add lesson */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => append({ videoKey: "", title: "" })}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 text-sm font-semibold text-neutral-400 hover:border-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Add another lesson
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer nav */}
                <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(s - 1, 0))}
                    disabled={step === 0}
                    className="h-10 px-5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                  >
                    ← Back
                  </button>

                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-full transition-all duration-300 bg-neutral-900",
                          i === step
                            ? "w-6 h-2"
                            : i < step
                            ? "w-2 h-2 opacity-40"
                            : "w-2 h-2 opacity-15"
                        )}
                      />
                    ))}
                  </div>

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating…
                        </>
                      ) : (
                        <>
                          <SendHorizontalIcon className="w-4 h-4" />
                          Publish Tutorial
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Page Skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="h-14 bg-neutral-900" />
      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <Skeleton className="h-72 w-full rounded-2xl bg-neutral-200" />
        </aside>
        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28 bg-neutral-100" />
                <Skeleton className="h-11 w-full bg-neutral-50" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Default Export ───────────────────────────────────────────────────────────

export default function CreateTutorialsView() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TutorialFormInner />
    </Suspense>
  );
}