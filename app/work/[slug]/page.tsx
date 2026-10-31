import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug, PROJECTS_DATA } from '@/src/data/projects';
import CaseStudyLayout from '@/src/components/projects/CaseStudyLayout';

interface WorkSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: WorkSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return {
      title: 'Project Not Found — ARRAKIS',
    };
  }
  return {
    title: `${project.title} — Case Study | ARRAKIS · Souvik Ghosh`,
    description: project.summary,
  };
}

export default async function WorkSlugPage({ params }: WorkSlugPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyLayout project={project} />;
}
