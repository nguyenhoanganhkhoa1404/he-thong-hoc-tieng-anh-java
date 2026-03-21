// app/courses/[id]/page.tsx — Server component (generateStaticParams must be in a non-"use client" file)
import { mockCourses } from "@/data/mockData";
import CourseDetailClient from "./CourseDetailClient";

// Tell Next.js static export which IDs to generate
export function generateStaticParams() {
  return mockCourses.map(c => ({ id: c.id }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseDetailClient id={id} />;
}
