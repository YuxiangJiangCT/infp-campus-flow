import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Grid3x3 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type ScheduleMode = 'template' | 'flexible';

interface ScheduleModeSelectorProps {
  onModeChange?: (mode: ScheduleMode) => void;
}

export function ScheduleModeSelector({ onModeChange }: ScheduleModeSelectorProps) {
  const [mode, setMode] = useLocalStorage<ScheduleMode>('scheduleMode', 'template');

  const handleModeChange = (value: string) => {
    if (value && (value === 'template' || value === 'flexible')) {
      setMode(value as ScheduleMode);
      onModeChange?.(value as ScheduleMode);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground font-medium">模式：</span>
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={handleModeChange}
        className="border rounded-lg p-1"
      >
        <ToggleGroupItem 
          value="template" 
          aria-label="模板模式"
          className="flex items-center gap-2 px-3 py-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm">模板模式</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="flexible" 
          aria-label="自定义模式"
          className="flex items-center gap-2 px-3 py-2"
        >
          <Grid3x3 className="h-4 w-4" />
          <span className="text-sm">自定义模式</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}