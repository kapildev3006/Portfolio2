
'use client';

import { useEffect, useState } from 'react';
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

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    toast({
      title: `${section} Settings Saved`,
      description: `Your ${section.toLowerCase()} settings have been updated.`,
    });
  };

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your website and account settings.</p>
      </div>

      <div className="grid gap-8">
        {/* General Settings */}
        <Card>
          <form onSubmit={(e) => handleSave(e, 'General')}>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general site settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" defaultValue="My Awesome Portfolio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input id="site-tagline" defaultValue="Full Stack Developer & Tech Enthusiast" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily take your site offline for visitors.
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save General Settings</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Theme Customization */}
        <Card>
          <form onSubmit={(e) => handleSave(e, 'Theme')}>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                 <div className="flex items-center gap-4">
                    {mounted ? (
                      <>
                        <Button
                          type="button"
                          variant={theme === 'light' ? 'default' : 'outline'}
                          onClick={() => setTheme('light')}
                          className="w-full"
                        >
                          Light Mode
                        </Button>
                        <Button
                          type="button"
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => setTheme('dark')}
                          className="w-full"
                        >
                          Dark Mode
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="button" variant="outline" className="w-full" disabled>Light Mode</Button>
                        <Button type="button" variant="outline" className="w-full" disabled>Dark Mode</Button>
                      </>
                    )}
                 </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="relative flex items-center">
                    <ColorWheelIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input id="primary-color" defaultValue="#4A90E2" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-select">Font Family</Label>
                <Select defaultValue="poppins">
                  <SelectTrigger id="font-select">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
             <CardFooter>
              <Button type="submit">Save Theme Settings</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account & Security */}
        <Card>
          <form onSubmit={(e) => handleSave(e, 'Account')}>
            <CardHeader>
              <CardTitle>Account & Security</CardTitle>
              <CardDescription>Manage your account details and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" type="button">Change Password</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa" className="text-base">
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Account Settings</Button>
            </CardFooter>
          </form>
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
      </div>
    </div>
  );
}
