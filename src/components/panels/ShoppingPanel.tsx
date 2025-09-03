import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingList {
  store: string;
  items: ShoppingItem[];
}

const initialShoppingLists: ShoppingList[] = [
  {
    store: "Tashkent Market主力清单",
    items: [
      { id: 't1', name: 'Pelmeni（俄式饺子）- 2kg装', completed: false },
      { id: 't2', name: 'Tvorog（奶渣）- 1.5kg', completed: false },
      { id: 't3', name: 'Kefir（酸奶饮品）- 3大瓶', completed: false },
      { id: 't4', name: '烤肉串 - 8-10串', completed: false },
      { id: 't5', name: 'Smetana（酸奶油）- 1kg', completed: false },
      { id: 't6', name: 'Kotlety（肉饼）- 10个', completed: false },
      { id: 't7', name: '黑面包 - 2条', completed: false },
      { id: 't8', name: '酸黄瓜 - 2大罐', completed: false },
      { id: 't9', name: 'Borsch（罗宋汤）- 1L', completed: false },
      { id: 't10', name: 'Halva（芝麻糖）- 300g', completed: false },
    ]
  },
  {
    store: "Trader Joe's补充清单",
    items: [
      { id: 'tj1', name: '牛油果 - 4个', completed: false },
      { id: 'tj2', name: '香蕉 - 1串', completed: false },
      { id: 'tj3', name: '蓝莓 - 2盒', completed: false },
      { id: 'tj4', name: 'Greek Yogurt - 大桶', completed: false },
      { id: 'tj5', name: 'Cold Brew咖啡 - 1瓶', completed: false },
      { id: 'tj6', name: '能量棒 - 1盒', completed: false },
      { id: 'tj7', name: 'Mac & Cheese - 3盒（应急）', completed: false },
    ]
  }
];

export function ShoppingPanel() {
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>('shoppingLists', initialShoppingLists);

  const toggleItem = (storeIndex: number, itemId: string) => {
    setShoppingLists((prev: ShoppingList[]) =>
      prev.map((store, index) =>
        index === storeIndex
          ? {
              ...store,
              items: store.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              )
            }
          : store
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">🛒 每周购物清单</h2>
      
      <div className="alert-success">
        <strong>购物安排：</strong>周日去Tashkent大采购，周三快速补货
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shoppingLists.map((list, storeIndex) => {
          const completedCount = list.items.filter(item => item.completed).length;
          const totalCount = list.items.length;
          const progressPercentage = (completedCount / totalCount) * 100;

          return (
            <Card key={storeIndex} className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {list.store}
                  <span className="text-sm font-medium text-muted-foreground">
                    {completedCount}/{totalCount}
                  </span>
                </CardTitle>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {list.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                    onClick={() => toggleItem(storeIndex, item.id)}
                  >
                    <Checkbox 
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(storeIndex, item.id)}
                    />
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="alert-warning">
        <strong>💰 预算：</strong>
        Tashkent $60-80/周 + TJ $30-40/周 = 总计 $90-120/周
      </div>
    </div>
  );
}