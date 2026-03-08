import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="w-full min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE TEXT */}
        <div className="space-y-6">
          
          {/* Big Title */}
          <Skeleton className="h-16 w-[80%] rounded-xl" />
          <Skeleton className="h-16 w-[60%] rounded-xl" />

          {/* Subtitle */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-5 w-[150px]" />
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-[140px] rounded-full" />

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center md:justify-end">
          <Skeleton className="w-[260px] h-[360px] md:w-[420px] md:h-[520px] rounded-3xl" />
        </div>

      </div>
    </div>
  );
}