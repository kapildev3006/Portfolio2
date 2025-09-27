import Image from 'next/image';
import Link from 'next/link';
import { Code, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex h-full transform flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6 pt-0">
        <CardTitle className="mb-2 font-headline">{project.title}</CardTitle>
        <CardDescription className="flex-grow text-muted-foreground">{project.description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-6 pt-0">
        {project.sourceUrl && (
          <Button asChild variant="outline" size="sm">
            <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Code />
              <span>Source</span>
            </Link>
          </Button>
        )}
        {project.liveUrl && (
          <Button asChild variant="default" size="sm">
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              <span>Live Demo</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
