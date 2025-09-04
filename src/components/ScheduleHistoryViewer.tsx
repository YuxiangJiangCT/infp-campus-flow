import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Calendar as CalendarIcon, CheckCircle2, Circle, Copy, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DailySchedule, FlexibleTask, FlexibleTimeBlock } from '@/hooks/useFlexibleSchedule';

interface ScheduleHistoryViewerProps {
  schedules: Record<string, DailySchedule>;
  onCopySchedule: (date: string) => void;
  currentDate?: string;
}

function TaskDisplay({ task }: { task: FlexibleTask }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background rounded border">
      {task.status === 'completed' ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
        {task.content}
      </span>
    </div>
  );
}

function TimeBlockDisplay({ timeBlock }: { timeBlock: FlexibleTimeBlock }) {
  const completedCount = timeBlock.assignedTasks.filter(t => t.status === 'completed').length;
  const totalCount = timeBlock.assignedTasks.length;
  
  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{timeBlock.time}</span>
        </div>
        {totalCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{totalCount}
          </Badge>
        )}
      </div>
      {totalCount > 0 && (
        <div className="space-y-1">
          {timeBlock.assignedTasks.map(task => (
            <TaskDisplay key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function DayScheduleView({ schedule, onCopy }: { schedule: DailySchedule | null, onCopy?: () => void }) {
  if (!schedule) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>该日期没有计划记录</p>
      </div>
    );
  }

  const allTasks = [
    ...schedule.unassignedTasks,
    ...schedule.timeBlocks.flatMap(b => b.assignedTasks)
  ];
  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const totalCount = allTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">完成进度</p>
          <p className="text-2xl font-bold">{completionRate}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">任务总数</p>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
        {onCopy && (
          <Button onClick={onCopy} size="sm" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            复制到今天
          </Button>
        )}
      </div>

      {/* Unassigned Tasks */}
      {schedule.unassignedTasks.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">未分配任务 ({schedule.unassignedTasks.length})</h4>
          <div className="space-y-1">
            {schedule.unassignedTasks.map(task => (
              <TaskDisplay key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Time Blocks */}
      <div>
        <h4 className="font-medium mb-2">时间安排</h4>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {schedule.timeBlocks
              .filter(block => block.assignedTasks.length > 0)
              .map((block, index) => (
                <TimeBlockDisplay key={index} timeBlock={block} />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function ScheduleHistoryViewer({
  schedules,
  onCopySchedule,
  currentDate = new Date().toISOString().split('T')[0]
}: ScheduleHistoryViewerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate));
  const [isOpen, setIsOpen] = useState(false);

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedSchedule = schedules[selectedDateString] || null;

  // Get dates that have schedules
  const scheduleDates = useMemo(() => {
    return Object.keys(schedules).map(dateStr => new Date(dateStr));
  }, [schedules]);

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleCopySchedule = () => {
    onCopySchedule(selectedDateString);
    setIsOpen(false);
  };

  const isToday = selectedDateString === currentDate;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          查看历史
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>历史计划记录</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Calendar Section */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  选择日期
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={zhCN}
                  modifiers={{
                    hasSchedule: scheduleDates
                  }}
                  modifiersStyles={{
                    hasSchedule: {
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      fontWeight: 'bold'
                    }
                  }}
                  className="rounded-md border"
                />
                <div className="mt-3 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreviousDay}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    前一天
                  </Button>
                  <span className="text-sm font-medium">
                    {format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })}
                    {isToday && <Badge className="ml-2" variant="default">今天</Badge>}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextDay}
                  >
                    后一天
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Display Section */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  计划详情
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DayScheduleView 
                  schedule={selectedSchedule} 
                  onCopy={!isToday ? handleCopySchedule : undefined}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}