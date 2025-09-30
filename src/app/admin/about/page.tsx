
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Experience, SkillCategory, PortfolioData } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { getPortfolioData } from '@/lib/portfolio-data';
import { Skeleton } from '@/components/ui/skeleton';

// Schemas for form validation
const skillSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  skills: z.string().min(5, 'Skills description is too short'),
});

const experienceSchema = z.object({
  role: z.string().min(2, 'Role is too short'),
  company: z.string().min(2, 'Company is too short'),
  period: z.string().min(4, 'Period is too short'),
  description: z.string().min(10, 'Description is too short'),
});

// Skill Form Component
const SkillForm = ({
  skill,
  onClose,
}: {
  skill?: SkillCategory;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill || { title: '', skills: '' },
  });

  const onSubmit = (values: z.infer<typeof skillSchema>) => {
    toast({
      title: `Skill ${skill ? 'Updated' : 'Added'}!`,
      description: `The skill "${values.title}" has been saved.`,
    });
    // In a real app, you would update the state or database here
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Next.js, TypeScript" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {skill ? 'Update Skill' : 'Add Skill'}
        </Button>
      </form>
    </Form>
  );
};

// Experience Form Component
const ExperienceForm = ({
  experience,
  onClose,
}: {
  experience?: Experience;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience || { role: '', company: '', period: '', description: '' },
  });

  const onSubmit = (values: z.infer<typeof experienceSchema>) => {
    toast({
      title: `Journey Item ${experience ? 'Updated' : 'Added'}!`,
      description: `The role "${values.role}" at "${values.company}" has been saved.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / Institution</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Freelance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date / Period</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2023 - Present" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your responsibilities and achievements." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {experience ? 'Update Journey Item' : 'Add Journey Item'}
        </Button>
      </form>
    </Form>
  );
};


export default function AdminAboutPage() {
  const [portfolioData, setPortfolioData] = React.useState<PortfolioData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const data = await getPortfolioData();
      setPortfolioData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !portfolioData) {
    return (
      <div className="flex-1 bg-background p-8 text-foreground">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { about } = portfolioData;

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Manage About Page</h1>
        <p className="text-muted-foreground">
          Update your skills and professional journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Manage Skills */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Skills</CardTitle>
              <CardDescription>Add, edit, or remove your skills.</CardDescription>
            </div>
            <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Add Skill</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                  <DialogDescription>Fill out the form to add a new skill category to your portfolio.</DialogDescription>
                </DialogHeader>
                <SkillForm onClose={() => setSkillDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {about.skills.map((skill, index) => (
              <Card key={index} className="flex items-center justify-between p-4 bg-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {skill.icon || <Wand2 />}
                  </div>
                  <div>
                    <p className="font-semibold">{skill.title}</p>
                    <p className="text-sm text-muted-foreground">{skill.skills}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                               <DialogTitle>Edit Skill</DialogTitle>
                               <DialogDescription>Update the details for this skill category.</DialogDescription>
                            </DialogHeader>
                            <SkillForm skill={skill} onClose={() => {}} />
                        </DialogContent>
                   </Dialog>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Manage Journey */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
              <CardTitle>Manage Journey</CardTitle>
              <CardDescription>Update your professional experience.</CardDescription>
            </div>
             <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Add Journey</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Journey Item</DialogTitle>
                  <DialogDescription>Fill out the form to add a new item to your professional journey.</DialogDescription>
                </DialogHeader>
                <ExperienceForm onClose={() => setExperienceDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {about.experience.map((item, index) => (
              <Card key={index} className="p-4 bg-secondary/50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        {item.icon || <Wand2 />}
                      </div>
                      <div>
                        <p className="font-semibold">{item.role}</p>
                        <p className="text-sm text-primary">{item.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                   <DialogTitle>Edit Journey Item</DialogTitle>
                                   <DialogDescription>Update the details for this journey item.</DialogDescription>
                                </DialogHeader>
                                <ExperienceForm experience={item} onClose={() => {}} />
                            </DialogContent>
                       </Dialog>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
