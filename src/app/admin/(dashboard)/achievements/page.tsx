
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
import type { Achievement } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Award, Edit, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { saveAchievementsData } from '@/lib/firestore-actions';
import { v4 as uuidv4 } from 'uuid';

const achievementSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  date: z.string().min(4, 'Date is too short'),
});

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

function AdminAchievementsPageSkeleton() {
  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminAchievementsPage() {
  const { portfolioData, loading } = React.useContext(PortfolioDataContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [achievements, setAchievements] = React.useState<Omit<Achievement, 'icon'>[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (portfolioData?.achievements) {
      setAchievements(portfolioData.achievements);
    }
  }, [portfolioData]);

  const handleSave = async (updatedAchievements: Omit<Achievement, 'icon'>[]) => {
    const result = await saveAchievementsData({ achievements: updatedAchievements });
    toast({
      title: result.success ? 'Success!' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const handleAchievementSave = (achievement: Omit<Achievement, 'icon'>) => {
    const existingIndex = achievements.findIndex(a => a.id === achievement.id);
    let updatedAchievements;
    if (existingIndex > -1) {
      updatedAchievements = [...achievements];
      updatedAchievements[existingIndex] = achievement;
    } else {
      updatedAchievements = [...achievements, achievement];
    }
    setAchievements(updatedAchievements);
    handleSave(updatedAchievements);
  };

  const handleAchievementDelete = (achievementId: string) => {
    const updatedAchievements = achievements.filter(a => a.id !== achievementId);
    setAchievements(updatedAchievements);
    handleSave(updatedAchievements);
    toast({ title: 'Achievement Deleted' });
  };

  if (loading || !portfolioData) {
    return <AdminAchievementsPageSkeleton />;
  }

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Manage Achievements</h1>
        <p className="text-muted-foreground">Add, edit, or remove your achievements.</p>
      </div>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>A list of your notable accomplishments.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Achievement</DialogTitle>
                <DialogDescription>Fill out the form to add a new achievement.</DialogDescription>
              </DialogHeader>
              <AchievementForm onSave={handleAchievementSave} onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="p-4 bg-secondary/50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Award />
                      </div>
                      <div>
                        <p className="font-semibold">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
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
                                <AchievementForm achievement={achievement} onSave={handleAchievementSave} onClose={() => {
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
                              This will permanently delete the achievement "{achievement.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleAchievementDelete(achievement.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{achievement.description}</p>
              </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
