
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Experience, SkillCategory, Achievement } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2, Wand2, Award, Rocket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { saveAboutData } from '@/lib/firestore-actions';
import { v4 as uuidv4 } from 'uuid';

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

const achievementSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  date: z.string().min(4, 'Date is too short'),
});

const aboutPageSchema = z.object({
  subtitle: z.string().min(10, 'Subtitle is too short'),
});

// Skill Form Component
const SkillForm = ({
  skill,
  onSave,
  onClose,
}: {
  skill?: Omit<SkillCategory, 'icon'>;
  onSave: (skill: Omit<SkillCategory, 'icon'>) => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill || { title: '', skills: '' },
  });

  const onSubmit = (values: z.infer<typeof skillSchema>) => {
    const newSkill = { id: skill?.id || uuidv4(), ...values };
    onSave(newSkill);
    toast({
      title: `Skill ${skill ? 'Updated' : 'Added'}!`,
      description: `The skill "${values.title}" has been saved.`,
    });
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
  onSave,
  onClose,
}: {
  experience?: Omit<Experience, 'icon'>;
  onSave: (experience: Omit<Experience, 'icon'>) => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience || { role: '', company: '', period: '', description: '' },
  });

  const onSubmit = (values: z.infer<typeof experienceSchema>) => {
    const newExperience = { id: experience?.id || uuidv4(), ...values };
    onSave(newExperience);
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

const AchievementForm = ({
  achievement,
  onSave,
  onClose,
}: {
  achievement?: Omit<Achievement, 'icon'>;
  onSave: (achievement: Omit<Achievement, 'icon'>) => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof achievementSchema>>({
    resolver: zodResolver(achievementSchema),
    defaultValues: achievement || { title: '', description: '', date: '' },
  });

  const onSubmit = (values: z.infer<typeof achievementSchema>) => {
    const newAchievement = { id: achievement?.id || uuidv4(), ...values };
    onSave(newAchievement);
    toast({
      title: `Achievement ${achievement ? 'Updated' : 'Added'}!`,
      description: `The achievement "${values.title}" has been saved.`,
    });
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hackathon Winner" {...field} />
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
                <Textarea placeholder="Describe the achievement." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder="e.g., May 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {achievement ? 'Update Achievement' : 'Add Achievement'}
        </Button>
      </form>
    </Form>
  );
};


function AdminAboutPageSkeleton() {
  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
        <Card>
           <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function AdminAboutPage() {
  const { portfolioData, loading } = React.useContext(PortfolioDataContext);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = React.useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = React.useState(false);

  const [currentSkills, setCurrentSkills] = React.useState<Omit<SkillCategory, 'icon'>[]>([]);
  const [currentExperience, setCurrentExperience] = React.useState<Omit<Experience, 'icon'>[]>([]);
  const [currentAchievements, setCurrentAchievements] = React.useState<Omit<Achievement, 'icon'>[]>([]);
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof aboutPageSchema>>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: {
      subtitle: '',
    },
  });

  React.useEffect(() => {
    if (portfolioData) {
      form.reset({
        subtitle: portfolioData.about.subtitle,
      })
      setCurrentSkills(portfolioData.about.skills);
      setCurrentExperience(portfolioData.about.experience);
      setCurrentAchievements(portfolioData.achievements);
    }
  }, [portfolioData, form]);
  
  const handleSave = async (
      subtitle: string,
      skills: Omit<SkillCategory, 'icon'>[], 
      experience: Omit<Experience, 'icon'>[],
      achievements: Omit<Achievement, 'icon'>[]
    ) => {
    const result = await saveAboutData({ subtitle, skills, experience, achievements });
    toast({
      title: result.success ? 'Success!' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const handleSubtitleSubmit = (values: z.infer<typeof aboutPageSchema>) => {
    handleSave(values.subtitle, currentSkills, currentExperience, currentAchievements);
  };

  const handleSkillSave = (skill: Omit<SkillCategory, 'icon'>) => {
    const existingIndex = currentSkills.findIndex(s => s.id === skill.id);
    let updatedSkills;
    if (existingIndex > -1) {
      updatedSkills = [...currentSkills];
      updatedSkills[existingIndex] = skill;
    } else {
      updatedSkills = [...currentSkills, skill];
    }
    setCurrentSkills(updatedSkills);
    handleSave(form.getValues('subtitle'), updatedSkills, currentExperience, currentAchievements);
  };

  const handleSkillDelete = (skillId: string) => {
    const updatedSkills = currentSkills.filter(s => s.id !== skillId);
    setCurrentSkills(updatedSkills);
    handleSave(form.getValues('subtitle'), updatedSkills, currentExperience, currentAchievements);
    toast({ title: 'Skill Deleted' });
  };
  
  const handleExperienceSave = (experience: Omit<Experience, 'icon'>) => {
    const existingIndex = currentExperience.findIndex(e => e.id === experience.id);
    let updatedExperience;
    if (existingIndex > -1) {
      updatedExperience = [...currentExperience];
      updatedExperience[existingIndex] = experience;
    } else {
      updatedExperience = [...currentExperience, experience];
    }
    setCurrentExperience(updatedExperience);
    handleSave(form.getValues('subtitle'), currentSkills, updatedExperience, currentAchievements);
  };

  const handleExperienceDelete = (experienceId: string) => {
    const updatedExperience = currentExperience.filter(e => e.id !== experienceId);
    setCurrentExperience(updatedExperience);
    handleSave(form.getValues('subtitle'), currentSkills, updatedExperience, currentAchievements);
    toast({ title: 'Journey Item Deleted' });
  };

  const handleAchievementSave = (achievement: Omit<Achievement, 'icon'>) => {
    const existingIndex = currentAchievements.findIndex(a => a.id === achievement.id);
    let updatedAchievements;
    if (existingIndex > -1) {
      updatedAchievements = [...currentAchievements];
      updatedAchievements[existingIndex] = achievement;
    } else {
      updatedAchievements = [...currentAchievements, achievement];
    }
    setCurrentAchievements(updatedAchievements);
    handleSave(form.getValues('subtitle'), currentSkills, currentExperience, updatedAchievements);
  };

  const handleAchievementDelete = (achievementId: string) => {
    const updatedAchievements = currentAchievements.filter(a => a.id !== achievementId);
    setCurrentAchievements(updatedAchievements);
    handleSave(form.getValues('subtitle'), currentSkills, currentExperience, updatedAchievements);
    toast({ title: 'Achievement Deleted' });
  };

  if (loading || !portfolioData) {
    return <AdminAboutPageSkeleton />;
  }

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Manage About Page</h1>
        <p className="text-muted-foreground">
          Update your bio, skills, professional journey, and achievements.
        </p>
      </div>

       <Card className="mb-8">
        <CardHeader>
          <CardTitle>About Page Bio</CardTitle>
          <CardDescription>
            This bio will be displayed on your public "About" page.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubtitleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio / Subtitle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A detailed paragraph about your passion, skills, and what you do."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Bio</Button>
              </form>
           </Form>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Manage Skills */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Skills</CardTitle>
              <CardDescription>Add, edit, or remove your skills.</CardDescription>
            </div>
            <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                  <DialogDescription>Fill out the form to add a new skill category.</DialogDescription>
                </DialogHeader>
                <SkillForm onSave={handleSkillSave} onClose={() => setSkillDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSkills.map((skill) => (
              <Card key={skill.id} className="flex items-center justify-between p-4 bg-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Wand2 />
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
                            <SkillForm skill={skill} onSave={handleSkillSave} onClose={() => {
                              const dialogTrigger = document.querySelector(`[aria-controls="radix-"][aria-expanded="true"]`);
                              if (dialogTrigger) (dialogTrigger as HTMLElement).click();
                            }} />
                        </DialogContent>
                   </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the skill "{skill.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleSkillDelete(skill.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                <Button><Plus className="mr-2 h-4 w-4" />Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Journey Item</DialogTitle>
                  <DialogDescription>Fill out the form to add a new item to your professional journey.</DialogDescription>
                </DialogHeader>
                <ExperienceForm onSave={handleExperienceSave} onClose={() => setExperienceDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentExperience.map((item) => (
              <Card key={item.id} className="p-4 bg-secondary/50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Rocket />
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
                                <ExperienceForm experience={item} onSave={handleExperienceSave} onClose={() => {
                                  const dialogTrigger = document.querySelector(`[aria-controls="radix-"][aria-expanded="true"]`);
                                  if (dialogTrigger) (dialogTrigger as HTMLElement).click();
                                }}/>
                            </DialogContent>
                       </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the journey item "{item.role} at {item.company}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleExperienceDelete(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Manage Achievements */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
              <CardTitle>Manage Achievements</CardTitle>
              <CardDescription>Update your accomplishments.</CardDescription>
            </div>
             <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Achievement</DialogTitle>
                  <DialogDescription>Fill out the form to add a new achievement.</DialogDescription>
                </DialogHeader>
                <AchievementForm onSave={handleAchievementSave} onClose={() => setAchievementDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAchievements.map((item) => (
              <Card key={item.id} className="p-4 bg-secondary/50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Award />
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                   <DialogTitle>Edit Achievement</DialogTitle>
                                   <DialogDescription>Update the details for this achievement.</DialogDescription>
                                </DialogHeader>
                                <AchievementForm achievement={item} onSave={handleAchievementSave} onClose={() => {
                                  const dialogTrigger = document.querySelector(`[aria-controls="radix-"][aria-expanded="true"]`);
                                  if (dialogTrigger) (dialogTrigger as HTMLElement).click();
                                }}/>
                            </DialogContent>
                       </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the achievement "{item.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleAchievementDelete(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
