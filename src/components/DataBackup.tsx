import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function DataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem('lastBackupDate')
  );

  // Export all localStorage data
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Collect all localStorage data
      const exportData: Record<string, any> = {};
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            // Try to parse JSON, if fails, store as string
            exportData[key] = JSON.parse(value);
          } catch {
            exportData[key] = value;
          }
        }
      });
      
      // Add metadata
      const fullExport = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        appName: 'INFP Campus Flow',
        dataKeys: keys,
        data: exportData,
        stats: {
          reflectionsCount: Object.keys(exportData.dailyReflections || {}).length,
          schedulesCount: Object.keys(exportData.flexibleSchedules || {}).length,
          totalSize: JSON.stringify(exportData).length
        }
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(fullExport, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `infp-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Update last backup date
      const now = new Date().toISOString();
      localStorage.setItem('lastBackupDate', now);
      setLastBackup(now);
      
      toast.success('数据导出成功！', {
        description: `已导出 ${keys.length} 个数据项`
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('导出失败', {
        description: '请查看控制台了解详情'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Import data from file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        // Validate import file
        if (!importData.version || !importData.data) {
          throw new Error('无效的备份文件格式');
        }
        
        // Show confirmation
        const confirmImport = window.confirm(
          `此备份包含：\n` +
          `- ${importData.stats?.reflectionsCount || 0} 条反思\n` +
          `- ${importData.stats?.schedulesCount || 0} 条日程\n` +
          `- 导出时间：${new Date(importData.exportDate).toLocaleString('zh-CN')}\n\n` +
          `导入将覆盖当前所有数据，是否继续？`
        );
        
        if (!confirmImport) {
          setIsImporting(false);
          return;
        }
        
        // Clear current localStorage
        const keysToKeep = ['lastBackupDate']; // Keep some meta keys
        Object.keys(localStorage).forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Import all data
        Object.entries(importData.data).forEach(([key, value]) => {
          localStorage.setItem(
            key, 
            typeof value === 'string' ? value : JSON.stringify(value)
          );
        });
        
        toast.success('数据导入成功！', {
          description: '页面将在3秒后刷新...'
        });
        
        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('导入失败', {
          description: error instanceof Error ? error.message : '请确保文件格式正确'
        });
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  // Calculate storage usage
  const calculateStorageUsage = () => {
    const totalSize = new Blob(Object.values(localStorage)).size;
    return (totalSize / 1024).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          数据备份与恢复
        </CardTitle>
        <CardDescription>
          导出您的所有数据用于备份，或从其他设备导入数据
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Info */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div>当前存储使用：{calculateStorageUsage()} KB</div>
              {lastBackup && (
                <div className="text-xs text-muted-foreground">
                  上次备份：{new Date(lastBackup).toLocaleString('zh-CN')}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Export Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">导出数据</h4>
          <p className="text-xs text-muted-foreground">
            将所有数据（反思、日程、任务等）导出为JSON文件
          </p>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
            variant="outline"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                导出中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                导出所有数据
              </>
            )}
          </Button>
        </div>

        {/* Import Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">导入数据</h4>
          <p className="text-xs text-muted-foreground">
            从备份文件恢复数据（将覆盖现有数据）
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button 
                asChild
                disabled={isImporting}
                className="w-full"
                variant="outline"
              >
                <span>
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      导入中...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      选择备份文件
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Tips */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="text-xs space-y-1 mt-1">
              <li>• 建议每周备份一次重要数据</li>
              <li>• 导入将覆盖所有现有数据，请谨慎操作</li>
              <li>• 备份文件可在不同设备间传输使用</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}