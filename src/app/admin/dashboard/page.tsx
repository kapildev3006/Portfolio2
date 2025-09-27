import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectManager from "@/components/admin/project-manager"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your portfolio content here.</p>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Site Content</CardTitle>
              <CardDescription>
                Update the content for the Hero and About sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Content management forms for Home and About sections would be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <ProjectManager />
        </TabsContent>
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>
                Here are the messages submitted through your contact form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>A list or table of contact form submissions would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
