

'use client';

import { useEffect, useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { saveSettingsData } from '@/lib/firestore-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const settingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  tagline: z.string().optional(),
  maintenanceMode: z.boolean(),
  theme: z.enum(['light', 'dark']),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color").optional(),
  fontFamily: z.string().optional(),
  adminEmail: z.string().email("Invalid email").optional(),
  twoFactorAuth: z.boolean(),
});

function SettingsSkeleton() {
  return (
    <div className="grid gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { portfolioData, loading, refreshPortfolioData } = useContext(PortfolioDataContext);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteTitle: '',
      tagline: '',
      maintenanceMode: false,
      theme: 'dark',
      primaryColor: '',
      fontFamily: 'poppins',
      adminEmail: '',
      twoFactorAuth: false,
    }
  });

  useEffect(() => {
    if (portfolioData?.settings) {
      form.reset({
        siteTitle: portfolioData.settings.siteTitle || portfolioData.hero.name || '',
        tagline: portfolioData.settings.tagline || '',
        maintenanceMode: portfolioData.settings.maintenanceMode || false,
        theme: portfolioData.settings.theme || 'dark',
        primaryColor: portfolioData.settings.primaryColor || '#4A90E2',
        fontFamily: portfolioData.settings.fontFamily || 'poppins',
        adminEmail: portfolioData.settings.adminEmail || '',
        twoFactorAuth: portfolioData.settings.twoFactorAuth || false,
      });
      setTheme(portfolioData.settings.theme || 'dark');
    } else if (portfolioData) {
       form.reset({
        siteTitle: portfolioData.hero.name || '',
       })
    }
  }, [portfolioData, form, setTheme]);


  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    const result = await saveSettingsData(values);
    toast({
      title: result.success ? 'Settings Saved' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive'
    });
    if(result.success) {
      await refreshPortfolioData();
    }
  };
  
  if (loading) {
    return (
       <div className="flex-1 bg-background p-8 text-foreground">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your website and account settings.</p>
          </div>
          <SettingsSkeleton />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your website and account settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          {/* General Settings */}
          <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general site settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                       <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Maintenance Mode
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Temporarily take your site offline for visitors.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={form.formState.isSubmitting}>Save General Settings</Button>
              </CardFooter>
          </Card>

          {/* Theme Customization */}
          <Card>
              <CardHeader>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>Customize the look and feel of your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Theme</FormLabel>
                      <FormControl>
                         <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant={field.value === 'light' ? 'default' : 'outline'}
                              onClick={() => { field.onChange('light'); setTheme('light'); }}
                              className="w-full"
                            >
                              Light Mode
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'dark' ? 'default' : 'outline'}
                              onClick={() => { field.onChange('dark'); setTheme('dark'); }}
                              className="w-full"
                            >
                              Dark Mode
                            </Button>
                         </div>
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                       <FormControl>
                        <div className="relative flex items-center">
                            <ColorWheelIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
                            <Input {...field} className="pl-10" />
                        </div>
                       </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="poppins">Poppins</SelectItem>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="lato">Lato</SelectItem>
                        </SelectContent>
                       </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>Save Theme Settings</Button>
              </CardFooter>
          </Card>

          {/* Account & Security */}
          <Card>
              <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>Manage your account details and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Button variant="outline" type="button">Change Password</Button>
                </div>
                 <FormField
                  control={form.control}
                  name="twoFactorAuth"
                  render={({ field }) => (
                     <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Two-Factor Authentication (2FA)
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>Save Account Settings</Button>
              </CardFooter>
          </Card>

          {/* Notification Settings Link */}
          <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">You can configure your notification preferences for emails and in-app alerts on the dedicated notifications settings page.</p>
              </CardContent>
              <CardFooter>
                  <Button asChild variant="secondary">
                      <Link href="/admin/notifications/settings">Go to Notification Settings</Link>
                  </Button>
              </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
