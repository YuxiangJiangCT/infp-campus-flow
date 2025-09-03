import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Template {
  id: string;
  title: string;
  content: string;
  category: 'initial' | 'followup' | 'thankyou';
}

interface FollowUpReminder {
  id: string;
  person: string;
  company: string;
  sentDate: string;
  nextFollowUp: string;
  completed: boolean;
}

const defaultTemplates: Template[] = [
  {
    id: '1',
    title: '初次联系模板',
    category: 'initial',
    content: `Hi [Name],

I hope this message finds you well! I'm currently a graduate student at [University] pursuing [Degree] and am actively seeking [Position Type] opportunities for [Timeline].

I came across your profile and was impressed by your experience at [Company]. I'm particularly interested in [Company] because of [Specific Reason - product/mission/tech stack].

I have a background in [Your Skills/Experience] and have been working on [Relevant Project/Experience]. I would really appreciate any insights you might have about the team culture and opportunities at [Company].

Would you be open to a brief coffee chat or call? I'd love to learn more about your experience and see if there might be a good fit.

Thank you for your time, and I look forward to hearing from you!

Best regards,
[Your Name]`
  },
  {
    id: '2',
    title: '技术专长强调模板',
    category: 'initial',
    content: `Hi [Name],

I hope you're doing well! I'm [Your Name], a [Degree] student at [University] with a strong background in [Tech Stack/Skills].

I've been following [Company]'s work in [Specific Area] and am really excited about [Specific Product/Initiative]. I recently completed [Relevant Project] where I [Achievement/Learning], which aligns well with the challenges at [Company].

I noticed you work in [Team/Department] and would love to learn more about:
- The technical challenges your team is working on
- The engineering culture at [Company]
- Any advice for someone looking to contribute to [Specific Area]

I've attached my resume and would be grateful for 15-20 minutes of your time for a quick call or coffee.

Looking forward to connecting!

Best,
[Your Name]
[LinkedIn Profile]`
  },
  {
    id: '3',
    title: 'Follow-up模板',
    category: 'followup',
    content: `Hi [Name],

I hope you're having a great week! I wanted to follow up on my message from [Date] about potential opportunities at [Company].

I understand you must be quite busy, but I wanted to share a quick update: [Recent Achievement/Project/Learning]. This has further strengthened my interest in [Company] and the [Team/Position] role.

If you have a few minutes in the coming weeks, I'd still love to chat about your experience at [Company] and learn more about the team.

No pressure at all - I appreciate any time you can spare!

Best regards,
[Your Name]`
  }
];

export function ReferralTemplatesPanel() {
  const [templates, setTemplates] = useLocalStorage<Template[]>('referralTemplates', defaultTemplates);
  const [followUps, setFollowUps] = useLocalStorage<FollowUpReminder[]>('followUpReminders', []);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const addFollowUpReminder = () => {
    const newReminder: FollowUpReminder = {
      id: Date.now().toString(),
      person: '',
      company: '',
      sentDate: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    };
    setFollowUps((prev: FollowUpReminder[]) => [...prev, newReminder]);
  };

  const updateFollowUp = (id: string, field: keyof FollowUpReminder, value: string | boolean) => {
    setFollowUps((prev: FollowUpReminder[]) =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, [field]: value } : reminder
      )
    );
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps((prev: FollowUpReminder[]) => prev.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">🤝 内推模板库</h2>
      
      {/* Templates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{template.title}</span>
                <span className="text-xs px-2 py-1 bg-primary/20 rounded-full">
                  {template.category}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {template.content}
                </pre>
              </div>
              <Button 
                onClick={() => copyToClipboard(template.content, template.id)}
                className="w-full"
                variant={copiedId === template.id ? "default" : "outline"}
              >
                {copiedId === template.id ? "✅ 已复制!" : "📋 复制模板"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follow-up Reminders Section */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>⏰ Follow-up 提醒</span>
            <Button onClick={addFollowUpReminder} size="sm">
              + 添加提醒
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {followUps.map((reminder) => (
              <div key={reminder.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-background rounded-lg border">
                <input
                  type="text"
                  placeholder="联系人姓名"
                  value={reminder.person}
                  onChange={(e) => updateFollowUp(reminder.id, 'person', e.target.value)}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="公司名称"
                  value={reminder.company}
                  onChange={(e) => updateFollowUp(reminder.id, 'company', e.target.value)}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="date"
                  value={reminder.sentDate}
                  onChange={(e) => updateFollowUp(reminder.id, 'sentDate', e.target.value)}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="date"
                  value={reminder.nextFollowUp}
                  onChange={(e) => updateFollowUp(reminder.id, 'nextFollowUp', e.target.value)}
                  className="px-3 py-2 border rounded"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={(e) => updateFollowUp(reminder.id, 'completed', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">完成</span>
                </div>
                <Button
                  onClick={() => deleteFollowUp(reminder.id)}
                  variant="destructive"
                  size="sm"
                >
                  删除
                </Button>
              </div>
            ))}
            
            {followUps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                还没有添加任何follow-up提醒。点击上方按钮开始添加！
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="alert-success">
        <strong>💡 使用建议：</strong>
        <ul className="mt-2 space-y-1">
          <li>• 个性化每条消息，提及具体的公司信息</li>
          <li>• 保持简洁，展示真诚的兴趣</li>
          <li>• Follow-up间隔建议：第一次7天，第二次14天</li>
          <li>• 记录所有联系，避免重复联系同一人</li>
        </ul>
      </div>
    </div>
  );
}