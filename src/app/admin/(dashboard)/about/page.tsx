
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Edit, Plus, Trash2, Wand2, Award, Rocket, GraduationCap, LayoutPanelLeft, Type, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Download, Save, ExternalLink } from 'lucide-react';
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
  isVisible: z.boolean().default(true).optional(),
});

const experienceSchema = z.object({
  role: z.string().min(2, 'Role is too short'),
  company: z.string().min(2, 'Company is too short'),
  period: z.string().min(4, 'Period is too short'),
  description: z.string().min(10, 'Description is too short'),
  certificateUrl: z.string().optional().or(z.literal('')),
  order: z.number().default(0),
  isVisible: z.boolean().default(true).optional(),
});

const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is too short'),
  school: z.string().min(2, 'School is too short'),
  period: z.string().min(4, 'Period is too short'),
  description: z.string().optional(),
  certificateUrl: z.string().optional().or(z.literal('')),
  order: z.number().default(0),
  isVisible: z.boolean().default(true).optional(),
});

const customSectionSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  content: z.string().min(10, 'Content is too short'),
  order: z.number().default(0),
  isVisible: z.boolean().default(true).optional(),
});

const achievementSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  date: z.string().min(4, 'Date is too short'),
  order: z.number().default(0),
  isVisible: z.boolean().default(true).optional(),
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
  achievements: z.string().optional(),
});

type SectionKey = 'bio' | 'skills' | 'experience' | 'education' | 'achievements';

const SECTION_CONFIGS: Record<SectionKey, { label: string; placeholder: string }> = {
  bio: { label: 'Bio Section', placeholder: 'My Bio' },
  skills: { label: 'Skills Section', placeholder: 'My Skills' },
  experience: { label: 'Experience Section', placeholder: 'Professional Journey' },
  education: { label: 'Education Section', placeholder: 'Education' },
  achievements: { label: 'Achievements Section', placeholder: 'Notable Achievements' },
};

const visibilitySchema = z.object({
  skills: z.boolean().default(true),
  experience: z.boolean().default(true),
  education: z.boolean().default(true),
  bio: z.boolean().default(true),
  achievements: z.boolean().default(true),
});

const sectionOrderSchema = z.object({
  bio: z.coerce.number().min(1).default(1),
  skills: z.coerce.number().min(1).default(2),
  experience: z.coerce.number().min(1).default(3),
  education: z.coerce.number().min(1).default(4),
  achievements: z.coerce.number().min(1).default(5),
});

// Form Components
const SkillForm = ({ skill, onSave, onClose }: { skill?: Omit<SkillCategory, 'icon'>; onSave: (skill: Omit<SkillCategory, 'icon'>) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof skillSchema>>({ 
    resolver: zodResolver(skillSchema), 
    defaultValues: {
      title: skill?.title ?? '',
      skills: skill?.skills ?? '',
      order: skill?.order ?? 0,
      isVisible: skill?.isVisible ?? true,
    }
  });

  React.useEffect(() => {
    form.reset({
      title: skill?.title ?? '',
      skills: skill?.skills ?? '',
      order: skill?.order ?? 0,
      isVisible: skill?.isVisible ?? true,
    });
  }, [skill, form]);

  const onSubmit = (values: z.infer<typeof skillSchema>) => {
    const newSkill = { id: skill?.id || uuidv4(), ...values };
    onSave(newSkill);
    toast({ title: `Skill Category ${skill ? 'Updated' : 'Added'}!`, description: `The category "${values.title}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem><FormLabel>Category Title</FormLabel><FormControl><Input placeholder="e.g., Frontend" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="skills" render={({ field }) => (
        <FormItem><FormLabel>Skills (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., React, Vue, Next.js" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => { const val = parseInt(e.target.value, 10); field.onChange(isNaN(val) ? 0 : val); }} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{skill ? 'Update Skill' : 'Add Skill'}</Button>
    </form></Form>
  );
};

const ExperienceForm = ({ experience, onSave, onClose }: { experience?: Omit<Experience, 'icon'>; onSave: (experience: Omit<Experience, 'icon'>) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof experienceSchema>>({ 
    resolver: zodResolver(experienceSchema), 
    defaultValues: {
      role: experience?.role ?? '',
      company: experience?.company ?? '',
      period: experience?.period ?? '',
      description: experience?.description ?? '',
      certificateUrl: experience?.certificateUrl ?? '',
      order: experience?.order ?? 0,
      isVisible: experience?.isVisible ?? true,
    } 
  });

  React.useEffect(() => {
    form.reset({
      role: experience?.role ?? '',
      company: experience?.company ?? '',
      period: experience?.period ?? '',
      description: experience?.description ?? '',
      certificateUrl: experience?.certificateUrl ?? '',
      order: experience?.order ?? 0,
      isVisible: experience?.isVisible ?? true,
    });
  }, [experience, form]);

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
          <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Senior Developer" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={form.control} name="period" render={({ field }) => (
        <FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2021 - Present" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Responsibilities..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="certificateUrl" render={({ field }) => (
        <FormItem>
          <FormLabel>Certificate / Credential Link (Optional)</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder="https://... (Paste certificate or credential link)" {...field} value={field.value ?? ''} className="pr-16" />
              {field.value ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs text-primary hover:text-primary"
                  onClick={() => window.open(field.value, '_blank')}
                  title="Test link"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Test
                </Button>
              ) : null}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => { const val = parseInt(e.target.value, 10); field.onChange(isNaN(val) ? 0 : val); }} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{experience ? 'Update Experience' : 'Add Experience'}</Button>
    </form></Form>
  );
};

const EducationForm = ({ item, onSave, onClose }: { item?: EducationItem; onSave: (item: EducationItem) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof educationSchema>>({ 
    resolver: zodResolver(educationSchema), 
    defaultValues: {
      degree: item?.degree ?? '',
      school: item?.school ?? '',
      period: item?.period ?? '',
      description: item?.description ?? '',
      order: item?.order ?? 0,
      isVisible: item?.isVisible ?? true,
    } 
  });

  React.useEffect(() => {
    form.reset({
      degree: item?.degree ?? '',
      school: item?.school ?? '',
      period: item?.period ?? '',
      description: item?.description ?? '',
      order: item?.order ?? 0,
      isVisible: item?.isVisible ?? true,
    });
  }, [item, form]);

  const onSubmit = (values: z.infer<typeof educationSchema>) => {
    const newItem = { id: item?.id || uuidv4(), ...values };
    onSave(newItem);
    toast({ title: `Education ${item ? 'Updated' : 'Added'}!`, description: `The degree from "${values.school}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="degree" render={({ field }) => (
        <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="e.g., B.Tech in CSE" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="school" render={({ field }) => (
        <FormItem><FormLabel>School/University</FormLabel><FormControl><Input placeholder="e.g., MIT" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="period" render={({ field }) => (
        <FormItem><FormLabel>Period</FormLabel><FormControl><Input placeholder="e.g., 2017 - 2021" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Key highlights..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => { const val = parseInt(e.target.value, 10); field.onChange(isNaN(val) ? 0 : val); }} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      <Button type="submit" className="w-full">{item ? 'Update Education' : 'Add Education'}</Button>
    </form></Form>
  );
};

const CustomSectionForm = ({ section, onSave, onClose }: { section?: CustomSection; onSave: (section: CustomSection) => void; onClose: () => void; }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof customSectionSchema>>({ 
    resolver: zodResolver(customSectionSchema), 
    defaultValues: {
      title: section?.title ?? '',
      content: section?.content ?? '',
      order: section?.order ?? 0,
      isVisible: section?.isVisible ?? true,
    } 
  });

  React.useEffect(() => {
    form.reset({
      title: section?.title ?? '',
      content: section?.content ?? '',
      order: section?.order ?? 0,
      isVisible: section?.isVisible ?? true,
    });
  }, [section, form]);

  const onSubmit = (values: z.infer<typeof customSectionSchema>) => {
    const newSection = { id: section?.id || uuidv4(), ...values };
    onSave(newSection);
    toast({ title: `Section ${section ? 'Updated' : 'Added'}!`, description: `The section "${values.title}" has been saved.` });
    onClose();
  };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input placeholder="e.g., Volunteering" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="content" render={({ field }) => (
        <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Content..." {...field} value={field.value ?? ''} className="min-h-[150px]" /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4 items-end">
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => { const val = parseInt(e.target.value, 10); field.onChange(isNaN(val) ? 0 : val); }} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
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
  const form = useForm<z.infer<typeof achievementSchema>>({ 
    resolver: zodResolver(achievementSchema), 
    defaultValues: {
      title: achievement?.title ?? '',
      description: achievement?.description ?? '',
      date: achievement?.date ?? '',
      order: achievement?.order ?? 0,
      isVisible: achievement?.isVisible ?? true,
    } 
  });
  
  const [certificateData, setCertificateData] = React.useState({
    url: achievement?.certificateUrl || '',
    name: achievement?.certificateName || '',
    allowDownload: achievement?.allowDownload ?? true,
    allowView: achievement?.allowView ?? true
  });

  React.useEffect(() => {
    form.reset({
      title: achievement?.title ?? '',
      description: achievement?.description ?? '',
      date: achievement?.date ?? '',
      order: achievement?.order ?? 0,
      isVisible: achievement?.isVisible ?? true,
    });
    setCertificateData({
      url: achievement?.certificateUrl || '',
      name: achievement?.certificateName || '',
      allowDownload: achievement?.allowDownload ?? true,
      allowView: achievement?.allowView ?? true
    });
  }, [achievement, form]);

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
        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Winner of..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Details..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date</FormLabel><FormControl><Input placeholder="e.g., 2023" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} onChange={e => { const val = parseInt(e.target.value, 10); field.onChange(isNaN(val) ? 0 : val); }} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-2 h-10">
            <FormLabel className="text-xs">Visible</FormLabel>
            <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
      </div>
      
      <div className="space-y-4 border-t pt-4">
        <FormLabel>Certificate Management</FormLabel>
        <div className="flex flex-col gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Upload Certificate File (PDF / Image)</Label>
              <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*,application/pdf" onChange={onFileUpload} disabled={uploading} className="flex-1" />
                  {uploading && <Loader2 className="animate-spin h-5 w-5" />}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Or Paste Certificate / Credential Link</Label>
              <Input 
                placeholder="https://... (Direct certificate link)" 
                value={certificateData.url} 
                onChange={e => setCertificateData(prev => ({ ...prev, url: e.target.value, name: prev.name || 'Certificate' }))} 
              />
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
  const { portfolioData, loading, refreshPortfolioData } = React.useContext(PortfolioDataContext);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = React.useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = React.useState(false);
  const [customSectionDialogOpen, setCustomSectionDialogOpen] = React.useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [currentSkills, setCurrentSkills] = React.useState<Omit<SkillCategory, 'icon'>[]>([]);
  const [currentExperience, setCurrentExperience] = React.useState<Omit<Experience, 'icon'>[]>([]);
  const [currentEducation, setCurrentEducation] = React.useState<EducationItem[]>([]);
  const [currentAchievements, setCurrentAchievements] = React.useState<Omit<Achievement, 'icon'>[]>([]);
  const [currentCustomSections, setCurrentCustomSections] = React.useState<CustomSection[]>([]);
  const [sectionOrderKeys, setSectionOrderKeys] = React.useState<SectionKey[]>([
    'bio',
    'skills',
    'experience',
    'education',
    'achievements',
  ]);
  
  const [editingItem, setEditingItem] = React.useState<any>(null);

  const { toast } = useToast();

  const mainForm = useForm<z.infer<typeof aboutPageSchema>>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: { subtitle: '', bio: '' },
  });

  const headingsForm = useForm<z.infer<typeof headingsSchema>>({
    resolver: zodResolver(headingsSchema),
    defaultValues: { skills: '', experience: '', education: '', bio: '', achievements: '' },
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
      headingsForm.reset(portfolioData.about.headings || { skills: 'My Skills', experience: 'Professional Journey', education: 'Education', bio: 'My Bio', achievements: 'Notable Achievements' });
      visibilityForm.reset(portfolioData.about.visibility || { skills: true, experience: true, education: true, bio: true, achievements: true });
      
      const order = portfolioData.about.sectionOrder || { bio: 1, skills: 2, experience: 3, education: 4, achievements: 5 };
      sectionOrderForm.reset(order);

      const keys: SectionKey[] = ['bio', 'skills', 'experience', 'education', 'achievements'];
      keys.sort((a, b) => (Number(order[a]) || 0) - (Number(order[b]) || 0));
      setSectionOrderKeys(keys);

      setCurrentSkills(portfolioData.about.skills);
      setCurrentExperience(portfolioData.about.experience);
      setCurrentEducation(portfolioData.about.education || []);
      setCurrentAchievements(portfolioData.achievements);
      setCurrentCustomSections(portfolioData.customSections || []);
    }
  }, [portfolioData, mainForm, headingsForm, visibilityForm, sectionOrderForm]);
  
  const handleSave = async (data: any = {}) => {
    setIsSaving(true);
    try {
      const orderValues = sectionOrderForm.getValues();
      const sanitizedOrder = {
        bio: Number(data.sectionOrder?.bio ?? orderValues.bio) || 1,
        skills: Number(data.sectionOrder?.skills ?? orderValues.skills) || 2,
        experience: Number(data.sectionOrder?.experience ?? orderValues.experience) || 3,
        education: Number(data.sectionOrder?.education ?? orderValues.education) || 4,
        achievements: Number(data.sectionOrder?.achievements ?? orderValues.achievements) || 5,
      };

      if (!data.sectionOrder) {
        const keys: SectionKey[] = ['bio', 'skills', 'experience', 'education', 'achievements'];
        keys.sort((a, b) => (Number(sanitizedOrder[a]) || 0) - (Number(sanitizedOrder[b]) || 0));
        setSectionOrderKeys(keys);
      }

      const result = await saveAboutData({
        subtitle: data.subtitle !== undefined ? data.subtitle : mainForm.getValues('subtitle'),
        bio: data.bio !== undefined ? data.bio : mainForm.getValues('bio'),
        skills: data.skills || currentSkills,
        experience: data.experience || currentExperience,
        education: data.education || currentEducation,
        achievements: data.achievements || currentAchievements,
        headings: data.headings || headingsForm.getValues(),
        visibility: data.visibility || visibilityForm.getValues(),
        sectionOrder: sanitizedOrder,
        customSections: data.customSections || currentCustomSections
      });

      if (result.success && refreshPortfolioData) {
        await refreshPortfolioData();
      }

      toast({ 
        title: result.success ? 'Success!' : 'Error', 
        description: result.message, 
        variant: result.success ? 'default' : 'destructive' 
      });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to save changes.', 
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateItem = (list: any[], setList: (l: any[]) => void, item: any) => {
    const exists = list.find(i => i.id === item.id);
    const updated = exists ? list.map(i => i.id === item.id ? item : i) : [...list, item];
    setList(updated);
    return updated;
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrderKeys.length) return;

    const newKeys = [...sectionOrderKeys];
    const temp = newKeys[index];
    newKeys[index] = newKeys[targetIndex];
    newKeys[targetIndex] = temp;

    const newOrder: Record<SectionKey, number> = {
      bio: 1,
      skills: 2,
      experience: 3,
      education: 4,
      achievements: 5,
    };

    newKeys.forEach((key, idx) => {
      newOrder[key] = idx + 1;
      sectionOrderForm.setValue(key, idx + 1);
    });

    setSectionOrderKeys(newKeys);
    await handleSave({ sectionOrder: newOrder });
  };

  const handleMoveSkill = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...currentSkills].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const reordered = sorted.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));

    setCurrentSkills(reordered);
    await handleSave({ skills: reordered });
  };

  const handleMoveExperience = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...currentExperience].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const reordered = sorted.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setCurrentExperience(reordered);
    await handleSave({ experience: reordered });
  };

  const handleMoveEducation = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...currentEducation].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const reordered = sorted.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setCurrentEducation(reordered);
    await handleSave({ education: reordered });
  };

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8 text-foreground max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Manage About Content</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Control your bio, skills, education, and custom sections.</p>
        </div>
        <Button onClick={() => handleSave({})} disabled={isSaving} size="default" className="shadow-lg w-full sm:w-auto">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0">
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
          <TabsList className="inline-flex h-11 w-max sm:w-full sm:grid sm:grid-cols-3 lg:grid-cols-6 p-1 bg-muted">
            <TabsTrigger value="general" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">General</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">Skills</TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">Experience</TabsTrigger>
            <TabsTrigger value="education" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">Education</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">Achievements</TabsTrigger>
            <TabsTrigger value="custom" className="text-xs sm:text-sm px-3 py-1.5 whitespace-nowrap">Custom</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader className="p-4 sm:p-6"><CardTitle>Main Bio & Subtitle</CardTitle></CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0"><Form {...mainForm}><form className="space-y-6">
                  <FormField control={mainForm.control} name="subtitle" render={({ field }) => (
                    <FormItem><FormLabel>Short Subtitle</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={mainForm.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel>Full Bio Content</FormLabel><FormControl><Textarea rows={10} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                </form></Form></CardContent>
              </div>
              <CardFooter className="p-4 sm:p-6 border-t flex justify-end bg-muted/20">
                <Button onClick={() => handleSave({})} disabled={isSaving} size="sm" className="w-full sm:w-auto">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Bio
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6 sm:space-y-8">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Section Headings & Visibility</CardTitle>
                  <CardDescription>Customize titles, toggle visibility, and use the up and down arrow buttons to reorder your sections.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                  {sectionOrderKeys.map((key, index) => {
                    const config = SECTION_CONFIGS[key];
                    return (
                      <div key={key} className="space-y-3 p-3.5 sm:p-4 rounded-xl border bg-secondary/30 transition-all duration-200">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                              #{index + 1}
                            </span>
                            <Label className="text-sm sm:text-base font-bold truncate">{config.label}</Label>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <div className="flex items-center gap-0.5">
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none" 
                                disabled={index === 0 || isSaving} 
                                onClick={() => handleMoveSection(index, 'up')}
                                title="Move section up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none" 
                                disabled={index === sectionOrderKeys.length - 1 || isSaving} 
                                onClick={() => handleMoveSection(index, 'down')}
                                title="Move section down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="h-4 w-px bg-border mx-1" />

                            <Form {...visibilityForm}>
                              <FormField control={visibilityForm.control} name={key} render={({ field }) => (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground hidden sm:inline">{field.value ? 'Visible' : 'Hidden'}</span>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </div>
                              )} />
                            </Form>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                          <div className="sm:col-span-3">
                            <Form {...headingsForm}>
                              <FormField control={headingsForm.control} name={key} render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Section Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder={config.placeholder} {...field} value={field.value ?? ''} />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </Form>
                          </div>
                          <div className="sm:col-span-1">
                            <Form {...sectionOrderForm}>
                              <FormField control={sectionOrderForm.control} name={key} render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Order</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min={1} 
                                      max={10} 
                                      {...field} 
                                      value={field.value ?? ''} 
                                      onChange={e => { 
                                        const val = parseInt(e.target.value, 10); 
                                        field.onChange(isNaN(val) ? '' : val); 
                                      }} 
                                    />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </Form>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter className="p-4 sm:p-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground">Order determines the display sequence on your live portfolio (1 appears first).</p>
                  <Button onClick={() => handleSave({})} disabled={isSaving} size="sm" className="w-full sm:w-auto ml-auto">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Headings & Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
              <div>
                <CardTitle>Skills Inventory</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">Use the up and down arrow buttons to shift the order of your skills.</CardDescription>
              </div>
              <Dialog open={skillDialogOpen} onOpenChange={(open) => { setSkillDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button className="w-full sm:w-auto" onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Skill</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Skill' : 'Add New Skill'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <SkillForm key={editingItem?.id || 'new-skill'} skill={editingItem} onSave={(s) => { const updated = updateItem(currentSkills, setCurrentSkills, s); handleSave({ skills: updated }); }} onClose={() => setSkillDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...currentSkills].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)).map((skill, index, arr) => (
                <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Wand2 className="text-primary shrink-0 w-5 h-5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm sm:text-base text-foreground truncate">
                        {skill.title} <span className="text-xs font-normal text-muted-foreground ml-1">(#{skill.order ?? index + 1})</span>
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">{skill.skills}</p>
                      {skill.isVisible === false && (
                        <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1">
                          <EyeOff size={10} /> Hidden from public site
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none" 
                      disabled={index === 0 || isSaving} 
                      onClick={() => handleMoveSkill(index, 'up')}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none" 
                      disabled={index === arr.length - 1 || isSaving} 
                      onClick={() => handleMoveSkill(index, 'down')}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => {
                        const updated = currentSkills.map(s => s.id === skill.id ? { ...s, isVisible: s.isVisible !== false ? false : true } : s);
                        setCurrentSkills(updated);
                        handleSave({ skills: updated });
                      }}
                      title={skill.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {skill.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(skill); setSkillDialogOpen(true); }} title="Edit skill"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { const filtered = currentSkills.filter(s => s.id !== skill.id); setCurrentSkills(filtered); handleSave({ skills: filtered }); }} title="Delete skill"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
              <div>
                <CardTitle>Professional Experience</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">Use the up and down arrow buttons to shift the order of your experience.</CardDescription>
              </div>
              <Dialog open={experienceDialogOpen} onOpenChange={(open) => { setExperienceDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button className="w-full sm:w-auto" onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Experience</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Experience' : 'Add New Journey Item'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <ExperienceForm key={editingItem?.id || 'new-exp'} experience={editingItem} onSave={(e) => { const updated = updateItem(currentExperience, setCurrentExperience, e); handleSave({ experience: updated }); }} onClose={() => setExperienceDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {[...currentExperience].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)).map((item, index, arr) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base text-foreground break-words">
                          {item.role} <span className="text-muted-foreground font-normal">at</span> {item.company} <span className="text-xs font-normal text-muted-foreground ml-1">(#{item.order ?? index + 1})</span>
                        </p>
                        <p className="text-primary text-xs sm:text-sm font-medium mt-0.5">{item.period}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 break-words whitespace-pre-wrap">{item.description}</p>
                        {item.certificateUrl && (
                          <div className="mt-2">
                            <a
                              href={item.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Certificate
                            </a>
                          </div>
                        )}
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      disabled={index === 0 || isSaving}
                      onClick={() => handleMoveExperience(index, 'up')}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      disabled={index === arr.length - 1 || isSaving}
                      onClick={() => handleMoveExperience(index, 'down')}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    {item.certificateUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => window.open(item.certificateUrl, '_blank')}
                        title="View Certificate"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => { const updated = currentExperience.map(e => e.id === item.id ? { ...e, isVisible: e.isVisible !== false ? false : true } : e); setCurrentExperience(updated); handleSave({ experience: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setExperienceDialogOpen(true); }} title="Edit experience"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { const filtered = currentExperience.filter(e => e.id !== item.id); setCurrentExperience(filtered); handleSave({ experience: filtered }); }} title="Delete experience"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
              <div>
                <CardTitle>Education Background</CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">Use the up and down arrow buttons to shift the order of your education.</CardDescription>
              </div>
              <Dialog open={educationDialogOpen} onOpenChange={(open) => { setEducationDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button className="w-full sm:w-auto" onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Education</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Education' : 'Add Education Item'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <EducationForm key={editingItem?.id || 'new-edu'} item={editingItem} onSave={(e) => { const updated = updateItem(currentEducation, setCurrentEducation, e); handleSave({ education: updated }); }} onClose={() => setEducationDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {[...currentEducation].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)).map((item, index, arr) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base text-foreground break-words">
                          {item.degree} <span className="text-muted-foreground font-normal">at</span> {item.school} <span className="text-xs font-normal text-muted-foreground ml-1">(#{item.order ?? index + 1})</span>
                        </p>
                        <p className="text-primary text-xs sm:text-sm font-medium mt-0.5">{item.period}</p>
                        {item.description && <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 break-words whitespace-pre-wrap">{item.description}</p>}
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      disabled={index === 0 || isSaving}
                      onClick={() => handleMoveEducation(index, 'up')}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      disabled={index === arr.length - 1 || isSaving}
                      onClick={() => handleMoveEducation(index, 'down')}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => { const updated = currentEducation.map(e => e.id === item.id ? { ...e, isVisible: e.isVisible !== false ? false : true } : e); setCurrentEducation(updated); handleSave({ education: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setEducationDialogOpen(true); }} title="Edit education"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { const filtered = currentEducation.filter(e => e.id !== item.id); setCurrentEducation(filtered); handleSave({ education: filtered }); }} title="Delete education"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Sections Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
              <div><CardTitle className="flex items-center gap-2"><LayoutPanelLeft className="w-5 h-5" /> Extra Page Sections</CardTitle></div>
              <Dialog open={customSectionDialogOpen} onOpenChange={(open) => { setCustomSectionDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button className="w-full sm:w-auto" onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add New Section</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Section' : 'Create Custom Section'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <CustomSectionForm key={editingItem?.id || 'new-custom'} section={editingItem} onSave={(s) => { const updated = updateItem(currentCustomSections, setCurrentCustomSections, s); handleSave({ customSections: updated }); }} onClose={() => setCustomSectionDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {currentCustomSections.sort((a, b) => a.order - b.order).map((section) => (
                <div key={section.id} className="p-3.5 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <p className="font-bold text-base sm:text-lg text-foreground">{section.title} <span className="text-xs font-normal text-muted-foreground ml-1">(Order: {section.order})</span></p>
                    <div className="flex items-center gap-1 self-end sm:self-center">
                      <Button 
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => { const updated = currentCustomSections.map(s => s.id === section.id ? { ...s, isVisible: s.isVisible !== false ? false : true } : s); setCurrentCustomSections(updated); handleSave({ customSections: updated }); }}
                        title={section.isVisible !== false ? "Hide from Public" : "Show to Public"}
                      >
                        {section.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(section); setCustomSectionDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { const filtered = currentCustomSections.filter(s => s.id !== section.id); setCurrentCustomSections(filtered); handleSave({ customSections: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap break-words">{section.content}</p>
                  {section.isVisible === false && <p className="text-[10px] text-destructive mt-2 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
           <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
              <div><CardTitle>Accomplishments</CardTitle></div>
              <Dialog open={achievementDialogOpen} onOpenChange={(open) => { setAchievementDialogOpen(open); if(!open) setEditingItem(null); }}>
                <DialogTrigger asChild><Button className="w-full sm:w-auto" onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" />Add Achievement</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle></DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <AchievementForm key={editingItem?.id || 'new-achieve'} achievement={editingItem} onSave={(a) => { const updated = updateItem(currentAchievements, setCurrentAchievements, a); handleSave({ achievements: updated }); }} onClose={() => setAchievementDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {currentAchievements.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base text-foreground break-words">
                          {item.title} <span className="text-xs font-normal text-muted-foreground ml-1">(Order: {item.order})</span>
                        </p>
                        <p className="text-primary text-xs sm:text-sm font-medium mt-0.5">{item.date}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 break-words whitespace-pre-wrap">{item.description}</p>
                        {item.isVisible === false && <p className="text-[10px] text-destructive mt-1 font-medium flex items-center gap-1"><EyeOff size={10}/> Hidden from public site</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                    {item.certificateUrl && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(item.certificateUrl, '_blank')} title="View Certificate">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => { const updated = currentAchievements.map(a => a.id === item.id ? { ...a, isVisible: a.isVisible !== false ? false : true } : a); setCurrentAchievements(updated); handleSave({ achievements: updated }); }}
                      title={item.isVisible !== false ? "Hide from Public" : "Show to Public"}
                    >
                      {item.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setAchievementDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { const filtered = currentAchievements.filter(a => a.id !== item.id); setCurrentAchievements(filtered); handleSave({ achievements: filtered }); }}><Trash2 className="h-4 w-4" /></Button>
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
