import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isToday as checkIsToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DayNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  hasDataForDate?: (date: Date) => boolean;
  className?: string;
}

export function DayNavigator({
  currentDate,
  onDateChange,
  hasDataForDate,
  className = ''
}: DayNavigatorProps) {
  const handlePreviousDay = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const isToday = checkIsToday(currentDate);
  const hasData = hasDataForDate ? hasDataForDate(currentDate) : false;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        size="sm"
        variant="outline"
        onClick={handlePreviousDay}
        title="前一天"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg min-w-[200px] justify-center">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {format(currentDate, 'MM月dd日 EEEE', { locale: zhCN })}
        </span>
        {isToday && (
          <Badge variant="default" className="text-xs py-0 px-1">
            今天
          </Badge>
        )}
        {hasData && !isToday && (
          <Badge variant="secondary" className="text-xs py-0 px-1">
            有记录
          </Badge>
        )}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleNextDay}
        title="后一天"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isToday && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleToday}
          title="返回今天"
        >
          今天
        </Button>
      )}
    </div>
  );
}