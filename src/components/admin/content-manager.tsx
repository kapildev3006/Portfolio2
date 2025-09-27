import { portfolioData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "../ui/badge"
import { X, PlusCircle } from "lucide-react"

export default function ContentManager() {
  const { hero, about } = portfolioData;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero & About Section</CardTitle>
          <CardDescription>
            Update the main content of your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-name">Your Name</Label>
            <Input id="hero-name" defaultValue={hero.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input id="hero-title" defaultValue={hero.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea id="hero-subtitle" defaultValue={hero.subtitle} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="about-description">About Me</Label>
            <Textarea id="about-description" defaultValue={about.description} rows={5} />
          </div>
           <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Manage the skills displayed in your about section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {about.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 pr-1">
                {skill}
                <button className="rounded-full bg-background p-0.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {skill}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Add a new skill" />
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile Photos</CardTitle>
          <CardDescription>
            Update the photos for your hero and about sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-image">Hero Image</Label>
            <Input id="hero-image" type="file" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="about-image">About Image</Label>
            <Input id="about-image" type="file" />
          </div>
          <div className="flex justify-end">
            <Button>Update Photos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
