import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/90 px-8 backdrop-blur-sm">
            <div>
                <h2 className="text-xl font-bold">Welcome back, Kapil!</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>KD</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
