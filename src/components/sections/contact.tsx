
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/actions/server-actions';
import { Github, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import Link from 'next/link';
import AnimatedDiv from '../animated-div';
import { Skeleton } from '../ui/skeleton';
import { contactFormSchema } from '@/lib/types';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

type ContactInfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
};

const ContactInfoCard = ({ icon, label, value, href }: ContactInfoCardProps) => {
  if (!value) return null;
  return (
    <Link href={href || '#'} className="block rounded-lg bg-secondary/50 p-6 transition-colors hover:bg-secondary">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      </div>
    </Link>
  );
};

export default function Contact() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { portfolioData, loading } = useContext(PortfolioDataContext);

  const [state, formAction] = useActionState(submitContactForm, {
    message: '',
    success: false,
  });

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        form.reset();
        formRef.current?.reset();
      }
    }
  }, [state, toast, form]);

  return (
    <section id="contact" className="w-full bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <AnimatedDiv className="space-y-8">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                Let's Connect
              </h2>
              <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl">
                Ready to bring your ideas to life? I'm here to help you create something amazing. Let's discuss your project and make it happen.
              </p>
            </div>
            {portfolioData ? (
                <div className="space-y-4">
                  <ContactInfoCard icon={<Mail />} label="Email" value={portfolioData.contact.email} href={`mailto:${portfolioData.contact.email}`} />
                  <ContactInfoCard icon={<Phone />} label="Phone" value={portfolioData.contact.phone} />
                  <ContactInfoCard icon={<MapPin />} label="Location" value={portfolioData.contact.location} />
                </div>
            ) : (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
            <div>
                <h3 className="font-headline text-lg font-semibold text-foreground">Follow Me</h3>
                <div className="mt-4 flex gap-4">
                  {portfolioData ? (
                    <>
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                          <Link href={portfolioData.socials.github}><Github /></Link>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                          <Link href={portfolioData.socials.linkedin}><Linkedin /></Link>
                      </Button>
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                          <Link href={portfolioData.socials.twitter}><Twitter /></Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </>
                  )}
                </div>
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv className="rounded-lg bg-card p-8 shadow-lg">
             <h3 className="font-headline text-3xl font-bold text-foreground">Send Message</h3>
            <Form {...form}>
              <form ref={formRef} action={formAction} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input placeholder="Project inquiry, collaboration, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell me about your project, requirements, timeline, or any questions you have..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    <Send className="mr-2"/>
                    Send Message
                </Button>
              </form>
            </Form>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
}
