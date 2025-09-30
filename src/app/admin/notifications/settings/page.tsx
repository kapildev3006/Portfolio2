
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettingsPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground">Manage how you receive notifications.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails for important events.
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div>
                <Label className="text-base">Notification Frequency</Label>
                <RadioGroup defaultValue="immediately" className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="immediately" id="immediately" className="peer sr-only" />
                    <Label
                      htmlFor="immediately"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Immediately
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="daily" id="daily" className="peer sr-only" />
                    <Label
                      htmlFor="daily"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Daily Digest
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="weekly" id="weekly" className="peer sr-only" />
                    <Label
                      htmlFor="weekly"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Weekly Digest
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Select which in-app alerts you want to see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="new-message" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="new-message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    New Contact Messages
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone sends you a message via the contact form.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="new-user" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="new-user"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    New User Registrations
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new user signs up.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="system-alerts" defaultChecked />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="system-alerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    System Alerts
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about system health and performance.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
