import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  completed: boolean;
}

interface TimeSlot {
  time: string;
  label: string;
  applications: JobApplication[];
}

const initialApplications: TimeSlot[] = [
  {
    time: "9:00-12:00",
    label: "早晨投递（精力最佳）",
    applications: [
      { id: 'm1', company: 'Google', position: 'Software Engineer', completed: false },
      { id: 'm2', company: 'Microsoft', position: 'SDE', completed: false },
      { id: 'm3', company: 'Apple', position: 'iOS Developer', completed: false },
      { id: 'm4', company: 'Meta', position: 'Frontend Engineer', completed: false },
      { id: 'm5', company: 'Amazon', position: 'Full Stack Developer', completed: false },
    ]
  },
  {
    time: "14:00-17:00",
    label: "下午投递（持续推进）",
    applications: [
      { id: 'a1', company: 'Netflix', position: 'Software Engineer', completed: false },
      { id: 'a2', company: 'Uber', position: 'Backend Engineer', completed: false },
      { id: 'a3', company: 'Airbnb', position: 'Full Stack Engineer', completed: false },
      { id: 'a4', company: 'Spotify', position: 'Web Developer', completed: false },
      { id: 'a5', company: 'Tesla', position: 'Software Developer', completed: false },
    ]
  },
  {
    time: "19:00-21:00",
    label: "晚间投递（收尾冲刺）",
    applications: [
      { id: 'e1', company: 'Adobe', position: 'Frontend Developer', completed: false },
      { id: 'e2', company: 'Salesforce', position: 'Software Engineer', completed: false },
      { id: 'e3', company: 'LinkedIn', position: 'Full Stack Developer', completed: false },
      { id: 'e4', company: 'Twitter', position: 'Web Engineer', completed: false },
      { id: 'e5', company: 'Stripe', position: 'Software Developer', completed: false },
    ]
  }
];

export function JobApplicationModule() {
  const [applicationSlots, setApplicationSlots] = useLocalStorage<TimeSlot[]>('jobApplications', initialApplications);

  const toggleApplication = (slotIndex: number, appId: string) => {
    setApplicationSlots((prev: TimeSlot[]) =>
      prev.map((slot, index) =>
        index === slotIndex
          ? {
              ...slot,
              applications: slot.applications.map(app =>
                app.id === appId ? { ...app, completed: !app.completed } : app
              )
            }
          : slot
      )
    );
  };

  const getTotalCompleted = () => {
    return applicationSlots.reduce((total, slot) => 
      total + slot.applications.filter(app => app.completed).length, 0
    );
  };

  const getTotalApplications = () => {
    return applicationSlots.reduce((total, slot) => total + slot.applications.length, 0);
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎯 秋招投递模块
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            今日进度: {getTotalCompleted()}/{getTotalApplications()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {applicationSlots.map((slot, slotIndex) => {
            const completed = slot.applications.filter(app => app.completed).length;
            const total = slot.applications.length;
            const progressPercentage = (completed / total) * 100;

            return (
              <div key={slotIndex} className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-primary">{slot.time}</h3>
                  <p className="text-sm text-muted-foreground">{slot.label}</p>
                  <div className="progress-bar mt-2">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {completed}/{total}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {slot.applications.map((app) => (
                    <div 
                      key={app.id}
                      className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleApplication(slotIndex, app.id)}
                    >
                      <Checkbox 
                        checked={app.completed}
                        onCheckedChange={() => toggleApplication(slotIndex, app.id)}
                      />
                      <div className={app.completed ? 'line-through text-muted-foreground' : ''}>
                        <div className="font-medium text-sm">{app.company}</div>
                        <div className="text-xs text-muted-foreground">{app.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">📊 今日投递统计</span>
            <span>目标: 15份/天</span>
          </div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill" 
              style={{ width: `${(getTotalCompleted() / 15) * 100}%` }}
            >
              {getTotalCompleted()}/15
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}