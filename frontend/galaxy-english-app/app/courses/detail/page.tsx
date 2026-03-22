// app/courses/detail/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { Suspense } from "react";

function Detail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) return <div className="text-white text-center mt-20">Loading course...</div>;
  return <CourseDetailClient id={id} />;
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <Detail />
    </Suspense>
  );
}
