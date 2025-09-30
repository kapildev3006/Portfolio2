
'use client';

import { BarChart, Book, Briefcase, BrainCircuit, Grip, Layers, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioData } from '@/lib/portfolio-data';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Process project data to get tag counts
const getProjectTagCounts = () => {
  const tagCounts: { [key: string]: number } = {};
  portfolioData.projects.forEach(project => {
    project.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Process skills data
const getSkillStats = () => {
  return portfolioData.about.skills.map(category => ({
    name: category.title,
    value: category.skills.split(',').length,
  }));
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const projectTagData = getProjectTagCounts();
const skillData = getSkillStats();
const totalProjects = portfolioData.projects.length;
const totalExperience = portfolioData.about.experience.length;
const totalSkillCategories = portfolioData.about.skills.length;
const totalServices = portfolioData.services.length;


const chartConfig = {
  value: {
    label: 'Count',
  },
  ...projectTagData.reduce((acc, tag) => {
    acc[tag.name] = { label: tag.name };
    return acc;
  }, {}),
  ...skillData.reduce((acc, skill) => {
    acc[skill.name] = { label: skill.name };
    return acc;
  }, {}),
};


export default function AdminStatsPage() {
  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">An overview of your portfolio data.</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">projects showcased</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Journey Milestones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExperience}</div>
            <p className="text-xs text-muted-foreground">experience entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skill Categories</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkillCategories}</div>
            <p className="text-xs text-muted-foreground">distinct skill areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services Offered</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">different services</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Project Tags Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Project Technology Usage
            </CardTitle>
            <CardDescription>Frequency of technologies used across projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <RechartsBarChart
                data={projectTagData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Skills Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Grip className="h-5 w-5"/>
              Skills Breakdown
            </CardTitle>
            <CardDescription>Number of skills per category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={skillData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  content={({ payload }) => {
                    return (
                      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                        {payload?.map((entry, index) => (
                          <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span>{entry.value}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
