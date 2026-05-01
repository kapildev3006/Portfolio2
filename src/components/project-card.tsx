'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Code, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useState } from 'react';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 100;
  const isLong = project.description.length > MAX_LENGTH;
  const displayedText = expanded || !isLong
    ? project.description
    : project.description.slice(0, MAX_LENGTH) + '...';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 h-full">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={project.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide
            ${project.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
              project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' :
              'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30'}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {project.title}
        </h3>

        {/* Description with Read More */}
        <div className="mb-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {displayedText}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 flex items-center gap-0.5 text-xs text-primary hover:underline font-medium"
            >
              {expanded ? (
                <><ChevronUp size={13} /> Read less</>
              ) : (
                <><ChevronDown size={13} /> Read more</>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Action buttons — Source left, Live Demo right */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            {project.sourceUrl ? (
              <Link
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              >
                <Code size={13} />
                Source
              </Link>
            ) : <span />}
          </div>
          <div>
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <ExternalLink size={13} />
                Live Demo
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>
    </div>
  );
}
