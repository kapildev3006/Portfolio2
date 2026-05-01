
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Experience, SkillCategory, Achievement, EducationItem, CustomSection } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2, Wand2, Award, Rocket, GraduationCap, LayoutPanelLeft, Type, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { saveAboutData } from '@/lib/firestore-actions';
import { uploadCertificateToCloudinary, downloadFileWithOriginalName } from '@/actions/upload-actions';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schemas for form validation
const skillSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  skills: z.string().min(5, 'Skills description is too short'),
  order: z.number().default(0),
});

const experienceSchema = z.object({
  role: z.string().min(2, 'Role is too short'),
  company: z.string().min(2, 'Company is too short'),
  period: z.string().min(4, 'Period is too short'),
  description: z.string().min(10, 'Description is too short'),
  order: z.number().default(0),
});

const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is too short'),
  school: z.string().min(2, 'School is too short'),
  period: z.string().min(4, 'Period is too short'),
  description: z.string().optional(),
  order: z.number().default(0),
});

const customSectionSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  content: z.string().min(10, 'Content is too short'),
  order: z.number().default(0),
});

const achievementSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  date: z.string().min(4, 'Date is too short'),
  order: z.number().default(0),
});

const aboutPageSchema = z.object({
  subtitle: z.string().min(10, 'Subtitle is too short'),
  bio: z.string().min(10, 'Bio is too short'),
});

const headingsSchema = z.object({
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
});

const visibilitySchema = z.object({
  skills: z.boolean().default(true),
  experience: z.boolean().default(true),
  education: z.boolean().default(true),
  bio: z.boolean().default(true),
  achievements: z.boolean().default(true),
});

const sectionOrderSchema = z.object({
  bio: z.number().default(1),
  skills: z.number().default(2),
  experience: z.number().default(3),
  education: z.number().default(4),
  achievements: z.number().default(5),
});

// Form Components
const SkillForm = ({ skill, onSave, onClose }: { skill?: Omit<SkillCategory, 'icon'>; onSave: (skill: Omit<SkillCategory, 'icon'>) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof skillSchema>>({ resolver: zodResolver(skillSchema), defaultValues: skill || { title: '', skills: '', order: 0, isVisible: true } });
  const onSubmit = (values: z.infer<typeof skillSchema>) => {
    const newSkill = { id: skill?.id || uuidv4(), ...values };
    onSave(newSkill);
    toast({ title: `Skill Category ${skill ? 'Updated' : 'Added'}!`, description: `The category "${values.title}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem><FormLabel>Category Title</FormLabel><FormControl><Input placeholder="e.g., Frontend" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="skills" render={({ field }) => (
        <FormItem><FormLabel>Skills (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., React, Vue, Next.js" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{skill ? 'Update Skill' : 'Add Skill'}</Button>
    </form></Form>
  );
};

const ExperienceForm = ({ experience, onSave, onClose }: { experience?: Omit<Experience, 'icon'>; onSave: (experience: Omit<Experience, 'icon'>) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof experienceSchema>>({ resolver: zodResolver(experienceSchema), defaultValues: experience || { role: '', company: '', period: '', description: '', order: 0, isVisible: true } });
  const onSubmit = (values: z.infer<typeof experienceSchema>) => {
    const newExp = { id: experience?.id || uuidv4(), ...values };
    onSave(newExp);
    toast({ title: `Experience ${experience ? 'Updated' : 'Added'}!`, description: `The role at "${values.company}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Senior Developer" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={form.control} name="period" render={({ field }) => (
        <FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2021 - Present" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Responsibilities..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{experience ? 'Update Experience' : 'Add Experience'}</Button>
    </form></Form>
  );
};

const EducationForm = ({ item, onSave, onClose }: { item?: EducationItem; onSave: (item: EducationItem) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof educationSchema>>({ resolver: zodResolver(educationSchema), defaultValues: item || { degree: '', school: '', period: '', description: '', order: 0, isVisible: true } });
  const onSubmit = (values: z.infer<typeof educationSchema>) => {
    const newItem = { id: item?.id || uuidv4(), ...values };
    onSave(newItem);
    toast({ title: `Education ${item ? 'Updated' : 'Added'}!`, description: `The degree from "${values.school}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="degree" render={({ field }) => (
        <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="e.g., B.Tech in CSE" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="school" render={({ field }) => (
        <FormItem><FormLabel>School/University</FormLabel><FormControl><Input placeholder="e.g., MIT" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="period" render={({ field }) => (
        <FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2017 - 2021" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Key highlights..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{item ? 'Update Education' : 'Add Education'}</Button>
    </form></Form>
  );
};

const CustomSectionForm = ({ section, onSave, onClose }: { section?: CustomSection; onSave: (section: CustomSection) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof customSectionSchema>>({ resolver: zodResolver(customSectionSchema), defaultValues: section || { title: '', content: '', order: 0, isVisible: true } });
  const onSubmit = (values: z.infer<typeof customSectionSchema>) => {
    const newSection = { id: section?.id || uuidv4(), ...values };
    onSave(newSection);
    toast({ title: `Section ${section ? 'Updated' : 'Added'}!`, description: `The section "${values.title}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input placeholder="e.g., Volunteering" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="content" render={({ field }) => (
        <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Content..." {...field} className="min-h-[150px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{section ? 'Update Section' : 'Add Section'}</Button>
    </form></Form>
  );
};

const AchievementForm = ({ achievement, onSave, onClose }: { achievement?: Omit<Achievement, 'icon'>; onSave: (achievement: Omit<Achievement, 'icon'>) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const form = useForm<z.infer<typeof achievementSchema>>({ resolver: zodResolver(achievementSchema), defaultValues: achievement || { title: '', description: '', date: '', order: 0, isVisible: true } });
  
  const [certificateData, setCertificateData] = React.useState({
    url: achievement?.certificateUrl || '',
    name: achievement?.certificateName || '',
    allowDownload: achievement?.allowDownload ?? true,
    allowView: achievement?.allowView ?? true
  });

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadCertificateToCloudinary(formData);
    if (result.success) {
      setCertificateData(prev => ({ ...prev, url: result.fileUrl!, name: result.originalFileName! }));
      toast({ title: 'Success', description: 'Certificate uploaded successfully!' });
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
    setUploading(false);
  };

  const handleAdminDownload = async () => {
    if (!certificateData.url) return;
    const result = await downloadFileWithOriginalName(certificateData.url, certificateData.name);
    if (result.success && result.fileBuffer) {
        const blob = new Blob([new Uint8Array(result.fileBuffer)], { type: result.contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName!;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
  };

  const onSubmit = (values: z.infer<typeof achievementSchema>) => {
    const newAchievement = { 
        id: achievement?.id || uuidv4(), 
        ...values,
        certificateUrl: certificateData.url,
        certificateName: certificateData.name,
        allowDownload: certificateData.allowDownload,
        allowView: certificateData.allowView
    };
    onSave(newAchievement);
    toast({ title: `Achievement ${achievement ? 'Updated' : 'Added'}!`, description: `The achievement "${values.title}" has been saved.` });
    onClose();
  };

  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Winner of..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Details..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date</FormLabel><FormControl><Input placeholder="e.g., 2023" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      
      <div className="space-y-4 border-t pt-4">
        <FormLabel>Certificate Management</FormLabel>
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Input type="file" accept="image/*,application/pdf" onChange={onFileUpload} disabled={uploading} className="flex-1" />
                {uploading && <Loader2 className="animate-spin h-5 w-5" />}
            </div>
            
            {certificateData.url && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium truncate max-w-[150px]">{certificateData.name}</span>
                        <span className="text-[10px] text-muted-foreground">Admin Controls</span>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => window.open(certificateData.url, '_blank')}><Eye className="h-3 w-3 mr-1" /> View</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleAdminDownload}><Download className="h-3 w-3 mr-1" /> Download</Button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm">Allow Visitor View</Label>
                    <p className="text-[10px] text-muted-foreground">Let users view this certificate in their browser.</p>
                </div>
                <Switch 
                    checked={certificateData.allowView} 
                    onCheckedChange={(checked) => setCertificateData(prev => ({ ...prev, allowView: checked }))} 
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm">Allow Visitor Download</Label>
                    <p className="text-[10px] text-muted-foreground">Let users download this certificate from the website.</p>
                </div>
                <Switch 
                    checked={certificateData.allowDownload} 
                    onCheckedChange={(checked) => setCertificateData(prev => ({ ...prev, allowDownload: checked }))} 
                />
            </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>{achievement ? 'Update Achievement' : 'Add Achievement'}</Button>
    </form></Form>
  );
};

export default function AdminAboutPage() {
  const { portfolioData, loading } = React.useContext(PortfolioDataContext);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = React.useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = React.useState(false);
  const [customSectionDialogOpen, setCustomSectionDialogOpen] = React.useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = React.useState(false);

  const [currentSkills, setCurrentSkills] = React.useState<Omit<SkillCategory, 'icon'>[]>([]);
  const [currentExperience, setCurrentExperience] = React.useState<Omit<Experience, 'icon'>[]>([]);
  const [currentEducation, setCurrentEducation] = React.useState<EducationItem[]>([]);
  const [currentAchievements, setCurrentAchievements] = React.useState<Omit<Achievement, 'icon'>[]>([]);
  const [currentCustomSections, setCurrentCustomSections] = React.useState<CustomSection[]>([]);
  
  const [editingItem, setEditingItem] = React.useState<any>(null);

  const { toast } = useToast();

  const mainForm = useForm<z.infer<typeof aboutPageSchema>>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: { subtitle: '', bio: '' },
  });

  const headingsForm = useForm<z.infer<typeof headingsSchema>>({
    resolver: zodResolver(headingsSchema),
    defaultValues: { skills: '', experience: '', education: '', bio: '' },
  });

  const visibilityForm = useForm<z.infer<typeof visibilitySchema>>({
    resolver: zodResolver(visibilitySchema),
    defaultValues: { skills: true, experience: true, education: true, bio: true, achievements: true },
  });

  const sectionOrderForm = useForm<z.infer<typeof sectionOrderSchema>>({
    resolver: zodResolver(sectionOrderSchema),
    defaultValues: { bio: 1, skills: 2, experience: 3, education: 4, achievements: 5 },
  });

  React.useEffect(() => {
    if (portfolioData) {
      mainForm.reset({ subtitle: portfolioData.about.subtitle, bio: portfolioData.about.bio || '' });
      headingsForm.reset(portfolioData.about.headings || { skills: 'My Skills', experience: 'Professional Journey', education: 'Education', bio: 'My Bio' });
      visibilityForm.reset(portfolioData.about.visibility || { skills: true, experience: true, education: true, bio: true, achievements: true });
      sectionOrderForm.reset(portfolioData.about.sectionOrder || { bio: 1, skills: 2, experience: 3, education: 4, achievements: 5 });
      setCurrentSkills(portfolioData.about.skills);
      setCurrentExperience(portfolioData.about.experience);
      setCurrentEducation(portfolioData.about.education || []);
      setCurrentAchievements(portfolioData.achievements);
      setCurrentCustomSections(portfolioData.customSections || []);
    }
  }, [portfolioData, mainForm, headingsForm, visibilityForm, sectionOrderForm]);
  
  const handleSave = async (data: any) => {
    const result = await saveAboutData({
      subtitle: data.subtitle || mainForm.getValues('subtitle'),
      bio: data.bio || mainForm.getValues('bio'),
      skills: data.skills || currentSkills,
      experience: data.experience || currentExperience,
      education: data.education || currentEducation,
      achievements: data.achievements || currentAchievements,
      headings: data.headings || headingsForm.getValues(),
      visibility: data.visibility || visibilityForm.getValues(),
      sectionOrder: data.sectionOrder || sectionOrderForm.getValues(),
      customSections: data.customSections || currentCustomSections
    });
    toast({ title: result.success ? 'Success!' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
  };

  const updateItem = (list: any[], setList: (l: any[]) => void, item: any) => {
    const exists = list.find(i => i.id === item.id);
    const updated = exists ? list.map(i => i.id === item.id ? item : i) : [...list, item];
    setList(updated);
    return updated;
  };

  return (
    <div className="flex-1 bg-background p-8 text-foreground max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Manage About Content</h1>
          <p className="text-muted-foreground mt-1">Control your bio, skills, education, and custom sections.</p>
        </div>
        <Button onClick={() => handleSave({})} size="lg" className="shadow-lg">Save All Changes</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="general">General & Visibility</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="custom">Custom Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Main Bio & Subtitle</CardTitle></CardHeader>
              <CardContent><Form {...mainForm}><form className="space-y-6">
                <FormField control={mainForm.control} name="subtitle" render={({ field }) => (
                  <FormItem><FormLabel>Short Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={mainForm.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Full Bio Content</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </form></Form></CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Section Headings & Visibility</CardTitle><CardDescription>Customize titles, toggle visibility, and set display order for each section.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio Heading & Visibility & Order */}
                  <div className="space-y-4 p-4 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Bio Section</Label>
                      <Form {...visibilityForm}><FormField control={visibilityForm.control} name="bio" render={({ field }) => (
                        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{field.value ? 'Visible' : 'Hidden'}</span><Switch checked={field.value} onCheckedChange={field.onChange} /></div>
                      )} /></Form>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <Form {...headingsForm}><FormField control={headingsForm.control} name="bio" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Section Title</FormLabel><FormControl><Input placeholder="My Bio" {...field} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                      <div className="col-span-1">
                        <Form {...sectionOrderForm}><FormField control={sectionOrderForm.control} name="bio" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                    </div>
                  </div>

                  {/* Skills Heading & Visibility & Order */}
                  <div className="space-y-4 p-4 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Skills Section</Label>
                      <Form {...visibilityForm}><FormField control={visibilityForm.control} name="skills" render={({ field }) => (
                        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{field.value ? 'Visible' : 'Hidden'}</span><Switch checked={field.value} onCheckedChange={field.onChange} /></div>
                      )} /></Form>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <Form {...headingsForm}><FormField control={headingsForm.control} name="skills" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Section Title</FormLabel><FormControl><Input placeholder="My Skills" {...field} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                      <div className="col-span-1">
                        <Form {...sectionOrderForm}><FormField control={sectionOrderForm.control} name="skills" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                    </div>
                  </div>

                  {/* Experience Heading & Visibility & Order */}
                  <div className="space-y-4 p-4 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Experience Section</Label>
                      <Form {...visibilityForm}><FormField control={visibilityForm.control} name="experience" render={({ field }) => (
                        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{field.value ? 'Visible' : 'Hidden'}</span><Switch checked={field.value} onCheckedChange={field.onChange} /></div>
                      )} /></Form>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <Form {...headingsForm}><FormField control={headingsForm.control} name="experience" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Section Title</FormLabel><FormControl><Input placeholder="Professional Journey" {...field} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                      <div className="col-span-1">
                        <Form {...sectionOrderForm}><FormField control={sectionOrderForm.control} name="experience" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                    </div>
                  </div>

                  {/* Education Heading & Visibility & Order */}
                  <div className="space-y-4 p-4 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-bold">Education Section</Label>
                      <Form {...visibilityForm}><FormField control={visibilityForm.control} name="education" render={({ field }) => (
                        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{field.value ? 'Visible' : 'Hidden'}</span><Switch checked={field.value} onCheckedChange={field.onChange} /></div>
                      )} /></Form>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <Form {...headingsForm}><FormField control={headingsForm.control} name="education" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Section Title</FormLabel><FormControl><Input placeholder="Education" {...field} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                      <div className="col-span-1">
                        <Form {...sectionOrderForm}><FormField control={sectionOrderForm.control} name="education" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs">Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                        )} /></Form>
                      </div>
                    </div>
                  </div>

                  {/* Achievements Visibility & Order */}
                  <div className="p-4 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-bold">Achievements Section</Label>
                      <Form {...visibilityForm}><FormField control={visibilityForm.control} name="achievements" render={({ field }) => (
                        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{field.value ? 'Visible' : 'Hidden'}</span><Switch checked={field.value} onCheckedChange={field.onChange} /></div>
                      )} /></Form>
                    </div>
                    <div className="grid grid-cols-4">
                        <div className="col-span-1">
                          <Form {...sectionOrderForm}><FormField control={sectionOrderForm.control} name="achievements" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                          )} /></Form>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Skills Inventory</CardTitle></div>
              <Dialog open={skillDialogOpen} onOpenChange={(open) => { setSkillDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Skill</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Skill' : 'Add New Skill'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <SkillForm skill={editingItem} onSave={(s) => { const updated = updateItem(currentSkills, setCurrentSkills, s); handleSave({ skills: updated }); }} onClose={() => setSkillDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSkills.sort((a, b) => (a.order || 0) - (b.order || 0)).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3"><Wand2 className="text-primary" /><div><p className="font-bold">{skill.title} <span className="text-xs font-normal text-muted-foreground ml-2">(#{skill.order || 0})</span></p><p className="text-xs text-muted-foreground">{skill.skills}</p></div></div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(skill); setSkillDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const filtered = currentSkills.filter(s => s.id !== skill.id); setCurrentSkills(filtered); handleSave({ skills: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Professional Experience</CardTitle></div>
              <Dialog open={experienceDialogOpen} onOpenChange={(open) => { setExperienceDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Experience</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Experience' : 'Add New Journey Item'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <ExperienceForm experience={editingItem} onSave={(e) => { const updated = updateItem(currentExperience, setCurrentExperience, e); handleSave({ experience: updated }); }} onClose={() => setExperienceDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentExperience.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-secondary/50 border border-border flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">{item.role} at {item.company} <span className="text-xs font-normal text-muted-foreground ml-2">(Order: {item.order})</span></p>
                        <p className="text-primary text-sm font-medium">{item.period}</p>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" size="icon" 
                      onClick={() => { const updated = currentExperience.map(e => e.id === item.id ? { ...e, isVisible: e.isVisible !== false ? false : true } : e); setCurrentExperience(updated); handleSave({ experience: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setExperienceDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const filtered = currentExperience.filter(e => e.id !== item.id); setCurrentExperience(filtered); handleSave({ experience: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Education Background</CardTitle></div>
              <Dialog open={educationDialogOpen} onOpenChange={(open) => { setEducationDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Education</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Education' : 'Add Education Item'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <EducationForm item={editingItem} onSave={(e) => { const updated = updateItem(currentEducation, setCurrentEducation, e); handleSave({ education: updated }); }} onClose={() => setEducationDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentEducation.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-secondary/50 border border-border flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">{item.degree} at {item.school} <span className="text-xs font-normal text-muted-foreground ml-2">(Order: {item.order})</span></p>
                        <p className="text-primary text-sm font-medium">{item.period}</p>
                        {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" size="icon" 
                      onClick={() => { const updated = currentEducation.map(e => e.id === item.id ? { ...e, isVisible: e.isVisible !== false ? false : true } : e); setCurrentEducation(updated); handleSave({ education: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setEducationDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const filtered = currentEducation.filter(e => e.id !== item.id); setCurrentEducation(filtered); handleSave({ education: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Sections Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle className="flex items-center gap-2"><LayoutPanelLeft className="w-5 h-5" /> Extra Page Sections</CardTitle></div>
              <Dialog open={customSectionDialogOpen} onOpenChange={(open) => { setCustomSectionDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add New Section</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Section' : 'Create Custom Section'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <CustomSectionForm section={editingItem} onSave={(s) => { const updated = updateItem(currentCustomSections, setCurrentCustomSections, s); handleSave({ customSections: updated }); }} onClose={() => setCustomSectionDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCustomSections.sort((a, b) => a.order - b.order).map((section) => (
                <div key={section.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg">{section.title} <span className="text-xs font-normal text-muted-foreground ml-2">(Order: {section.order})</span></p>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" size="icon" 
                        onClick={() => { const updated = currentCustomSections.map(s => s.id === section.id ? { ...s, isVisible: s.isVisible !== false ? false : true } : s); setCurrentCustomSections(updated); handleSave({ customSections: updated }); }}
                        title={section.isVisible !== false ? "Hide from Public" : "Show to Public"}
                      >
                        {section.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingItem(section); setCustomSectionDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const filtered = currentCustomSections.filter(s => s.id !== section.id); setCurrentCustomSections(filtered); handleSave({ customSections: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                  {section.isVisible === false && <p className="text-[10px] text-destructive mt-2 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Accomplishments</CardTitle></div>
              <Dialog open={achievementDialogOpen} onOpenChange={(open) => { setAchievementDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Achievement</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <AchievementForm achievement={editingItem} onSave={(a) => { const updated = updateItem(currentAchievements, setCurrentAchievements, a); handleSave({ achievements: updated }); }} onClose={() => setAchievementDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentAchievements.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-secondary/50 border border-border flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">{item.title} <span className="text-xs font-normal text-muted-foreground ml-2">(Order: {item.order})</span></p>
                        <p className="text-primary text-sm font-medium">{item.date}</p>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {item.certificateUrl && (
                      <Button variant="ghost" size="icon" onClick={() => window.open(item.certificateUrl, '_blank')} title="View Certificate">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" size="icon" 
                      onClick={() => { const updated = currentAchievements.map(a => a.id === item.id ? { ...a, isVisible: a.isVisible !== false ? false : true } : a); setCurrentAchievements(updated); handleSave({ achievements: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setAchievementDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const filtered = currentAchievements.filter(a => a.id !== item.id); setCurrentAchievements(filtered); handleSave({ achievements: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
