export interface LowStockItem {
  sku: string
  name: string
  stock: number
  riskLevel: 'critical' | 'high' | 'medium'
  runoutDays: number
  velocity: number
}

export interface ReorderSuggestion {
  sku: string
  name: string
  currentStock: number
  suggestedQty: number
  estimatedCost: number
  priority: 'urgent' | 'high' | 'normal'
}

export interface VelocityDataPoint {
  month: string
  sales: number
  forecast: number
}

export interface AIInsight {
  type: 'warning' | 'recommendation' | 'insight'
  message: string
  confidence: number
}

export interface HeroPreviewItem {
  name: string
  stock: number
  runout: number
  qty: number
}

export interface DashboardStat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
}

export interface DashboardChartItem {
  month: string
  value: number
}

export interface DashboardRecentItem {
  sku: string
  name: string
  stock: number
  status: 'critical' | 'low' | 'moderate' | 'healthy'
  days: number
}

export interface WorkflowStep {
  text: string
  inefficient?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface InventoryItem {
  id: string
  product: string
  stockLeft: number
  daysLeft: number
  suggestedReorder: number
  reason: string
  priority: 'critical' | 'high' | 'medium'
}

export const lowStockItems: LowStockItem[] = [
  {
    sku: 'ALM-001',
    name: 'Organic Almond Milk',
    stock: 8,
    riskLevel: 'critical',
    runoutDays: 3,
    velocity: 2.7,
  },
  {
    sku: 'BRD-045',
    name: 'Whole Wheat Bread',
    stock: 15,
    riskLevel: 'high',
    runoutDays: 5,
    velocity: 3.0,
  },
  {
    sku: 'YOG-112',
    name: 'Greek Yogurt 32oz',
    stock: 22,
    riskLevel: 'high',
    runoutDays: 7,
    velocity: 3.1,
  },
  {
    sku: 'CHZ-203',
    name: 'Cheddar Cheese Block',
    stock: 18,
    riskLevel: 'medium',
    runoutDays: 9,
    velocity: 2.0,
  },
]

export const reorderSuggestions: ReorderSuggestion[] = [
  {
    sku: 'ALM-001',
    name: 'Organic Almond Milk',
    currentStock: 8,
    suggestedQty: 96,
    estimatedCost: 480,
    priority: 'urgent',
  },
  {
    sku: 'BRD-045',
    name: 'Whole Wheat Bread',
    currentStock: 15,
    suggestedQty: 72,
    estimatedCost: 216,
    priority: 'high',
  },
  {
    sku: 'YOG-112',
    name: 'Greek Yogurt 32oz',
    currentStock: 22,
    suggestedQty: 108,
    estimatedCost: 540,
    priority: 'high',
  },
]

export const heroPreviewItems: HeroPreviewItem[] = [
  { name: 'Organic Almond Milk', stock: 8, runout: 3, qty: 96 },
  { name: 'Whole Wheat Bread', stock: 15, runout: 5, qty: 72 },
  { name: 'Greek Yogurt 32oz', stock: 22, runout: 7, qty: 108 },
]

export const velocityData: VelocityDataPoint[] = [
  { month: 'Jan', sales: 1240, forecast: 1200 },
  { month: 'Feb', sales: 1380, forecast: 1350 },
  { month: 'Mar', sales: 1520, forecast: 1480 },
  { month: 'Apr', sales: 1340, forecast: 1400 },
  { month: 'May', sales: 1680, forecast: 1620 },
  { month: 'Jun', sales: 1820, forecast: 1780 },
]

export const dashboardStats = [
  { label: 'Total SKUs', value: '2,847', change: '+12%', trend: 'up' as const, icon: 'Package' },
  { label: 'Low Stock', value: '23', change: '-8%', trend: 'down' as const, icon: 'AlertTriangle' },
  { label: 'Reorder Value', value: '$142K', change: '+18%', trend: 'up' as const, icon: 'DollarSign' },
  { label: 'Forecast Accuracy', value: '94.2%', change: '+2.1%', trend: 'up' as const, icon: 'TrendingUp' },
]

export const dashboardChartData: DashboardChartItem[] = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 82 },
  { month: 'Apr', value: 71 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 92 },
]

export const dashboardRecentItems: DashboardRecentItem[] = [
  { sku: 'ALM-001', name: 'Organic Almond Milk', stock: 8, status: 'critical', days: 3 },
  { sku: 'BRD-045', name: 'Whole Wheat Bread', stock: 15, status: 'low', days: 5 },
  { sku: 'YOG-112', name: 'Greek Yogurt 32oz', stock: 22, status: 'moderate', days: 7 },
  { sku: 'CHZ-203', name: 'Cheddar Cheese Block', stock: 45, status: 'healthy', days: 14 },
]

export const manualWorkflow: WorkflowStep[] = [
  { text: 'Review spreadsheet for low stock items', inefficient: true },
  { text: 'Check supplier lead times manually', inefficient: true },
  { text: 'Calculate reorder quantities by intuition', inefficient: true },
  { text: 'Email suppliers for pricing and availability', inefficient: true },
  { text: 'Wait for responses (1-3 days)', inefficient: true },
  { text: 'Update inventory records after delivery', inefficient: true },
]

export const predictiveWorkflow: WorkflowStep[] = [
  { text: 'System flags low-stock items automatically' },
  { text: 'Calculates exact runout dates from sales data' },
  { text: 'Optimal quantities calculated from velocity' },
  { text: 'Supplier integration provides real-time pricing' },
  { text: 'One-click approval generates purchase orders' },
  { text: 'Inventory updates automatically on receipt' },
]

export const conversationData: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What should I reorder today?',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Based on current inventory levels and sales velocity, I recommend reordering:\n\n• Almond Milk (24 units left, 3 days) - Order 96 units\n• Whole Wheat Bread (18 units left, 4 days) - Order 72 units\n\nBoth items show consistent demand and will reach critical levels by this weekend.',
  },
  {
    id: '3',
    role: 'user',
    content: 'Why is the bread quantity higher than usual?',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Great question! The bread reorder quantity is optimized for the upcoming weekend. Historical data shows a 40% sales spike on Saturdays, and your current stock won\'t cover that demand surge. The suggested 72 units accounts for this pattern.',
  },
]

export const aiInsights: AIInsight[] = [
  {
    type: 'warning',
    message: 'Organic Almond Milk will run out in 3 days based on current velocity',
    confidence: 96,
  },
  {
    type: 'recommendation',
    message: 'Consider bulk ordering Greek Yogurt - 15% supplier discount available',
    confidence: 88,
  },
  {
    type: 'insight',
    message: 'Sales velocity increased 22% this month vs. historical average',
    confidence: 94,
  },
]

export const inventoryTableData: InventoryItem[] = [
  {
    id: 'INV-001',
    product: 'Organic Free-Range Eggs (Dozen)',
    stockLeft: 12,
    daysLeft: 2,
    suggestedReorder: 144,
    reason: 'High weekend demand spike',
    priority: 'critical',
  },
  {
    id: 'INV-002',
    product: 'Almond Milk 1L Unsweetened',
    stockLeft: 24,
    daysLeft: 3,
    suggestedReorder: 96,
    reason: 'Consistent daily sales velocity',
    priority: 'critical',
  },
  {
    id: 'INV-003',
    product: 'Whole Wheat Bread Loaf',
    stockLeft: 18,
    daysLeft: 4,
    suggestedReorder: 72,
    reason: 'Approaching weekend rush',
    priority: 'high',
  },
  {
    id: 'INV-004',
    product: 'Greek Yogurt 500g Plain',
    stockLeft: 36,
    daysLeft: 5,
    suggestedReorder: 120,
    reason: 'Regular replenishment cycle',
    priority: 'high',
  },
  {
    id: 'INV-005',
    product: 'Fresh Ground Coffee 340g',
    stockLeft: 28,
    daysLeft: 6,
    suggestedReorder: 48,
    reason: 'Steady morning traffic pattern',
    priority: 'high',
  },
  {
    id: 'INV-006',
    product: 'Cherry Tomatoes 250g Pack',
    stockLeft: 45,
    daysLeft: 7,
    suggestedReorder: 80,
    reason: 'Seasonal demand increase',
    priority: 'medium',
  },
  {
    id: 'INV-007',
    product: 'Grass-Fed Butter 250g',
    stockLeft: 32,
    daysLeft: 8,
    suggestedReorder: 64,
    reason: 'Standard restock threshold',
    priority: 'medium',
  },
  {
    id: 'INV-008',
    product: 'Baby Spinach 200g Bag',
    stockLeft: 22,
    daysLeft: 5,
    suggestedReorder: 96,
    reason: 'Short shelf life consideration',
    priority: 'high',
  },
]
