

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Send, Smile } from 'lucide-react';

const contacts = [
    { name: 'Alice', message: 'Hey, how are you?', time: '10:30 AM', avatar: 'A' },
    { name: 'Bob', message: 'Meeting at 2 PM.', time: '9:15 AM', avatar: 'B' },
    { name: 'Charlie', message: 'Can you send the file?', time: 'Yesterday', avatar: 'C' },
    { name: 'Diana', message: 'Thanks for the update! This is a very long message preview that should wrap.', time: 'Yesterday', avatar: 'D' },
];

const messages = [
  { from: 'them', text: 'Hey, I saw your portfolio, amazing work!', time: '10:40 AM' },
  { from: 'me', text: 'Thank you so much! I appreciate it.', time: '10:41 AM' },
  { from: 'me', text: 'Is there a project you have in mind?', time: '10:41 AM' },
  { from: 'them', text: 'Yes, I have a startup and need a web application. Can we schedule a call?', time: '10:42 AM' },
  { from: 'them', text: 'Here is a very long message that might overflow the container if word wrapping is not handled correctly. Let\'s see if this breaks the layout. averylongwordthatshouldbreakandwraptonextline.com', time: '10:43 AM' },
];


export default function AdminChatPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-1 bg-background text-foreground">
      <aside className="w-1/4 border-r border-border p-4">
        <h2 className="text-2xl font-bold mb-4">Conversations</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-10" />
        </div>
        <div className="space-y-2">
            {contacts.map((contact, index) => (
               <Card key={index} className="p-3 bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                 <div className="flex items-center gap-3">
                    <Avatar>
                       <AvatarFallback>{contact.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-center">
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.time}</p>
                       </div>
                       <p className="text-sm text-muted-foreground break-words">{contact.message}</p>
                    </div>
                 </div>
               </Card>
            ))}
        </div>
      </aside>
      <main className="flex w-3/4 flex-col">
        <header className="border-b border-border p-4">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-xl font-semibold">Alice</h3>
                    <p className="text-sm text-green-500">Online</p>
                </div>
            </div>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'them' && <Avatar className="h-8 w-8"><AvatarFallback>A</AvatarFallback></Avatar>}
              <div className={`max-w-md rounded-lg p-3 ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                <p className="break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
              </div>
               {msg.from === 'me' && <Avatar className="h-8 w-8"><AvatarFallback>You</AvatarFallback></Avatar>}
            </div>
          ))}
        </div>
        <footer className="border-t border-border p-4">
          <div className="relative">
            <Input placeholder="Type a message..." className="pr-24" />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <Button variant="ghost" size="icon"><Smile/></Button>
                <Button><Send /></Button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
