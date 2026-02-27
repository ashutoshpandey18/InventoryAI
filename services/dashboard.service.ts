import { prisma } from "@/lib/prisma";

const DAYS_HISTORY = 30;
const DAYS_LEFT_THRESHOLD = 3;
const FAST_MOVING_THRESHOLD = 5;

interface DashboardSummary {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  deadStockCount: number;
}

interface LowStockItem {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  daysLeft: number | null;
  reason: string;
}

interface ReorderSuggestion {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
  daysLeft: number;
  suggestedReorderQty: number;
}

interface DeadStockItem {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  daysSinceLastSale: number | null;
}

interface FastMovingItem {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
}

interface DashboardData {
  summary: DashboardSummary;
  lowStockItems: LowStockItem[];
  reorderSuggestions: ReorderSuggestion[];
  deadStockItems: DeadStockItem[];
  fastMovingItems: FastMovingItem[];
}

export class DashboardService {
  async getDashboardData(storeId: string): Promise<DashboardData> {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_HISTORY);

    const products = await prisma.product.findMany({
      where: { storeId },
      include: {
        inventory: true,
      },
    });

    if (products.length === 0) {
      return this.getEmptyDashboard();
    }

    const productIds = products.map((p) => p.id);

    const predictions = await prisma.prediction.findMany({
      where: {
        productId: { in: productIds },
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["productId"],
    });

    const predictionMap = new Map(
      predictions.map((p) => [p.productId, p])
    );

    const salesByProduct = await prisma.sale.groupBy({
      by: ["productId"],
      where: {
        productId: { in: productIds },
        soldAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        quantity: true,
      },
      _max: {
        soldAt: true,
      },
    });

    const salesMap = new Map(
      salesByProduct.map((s) => [
        s.productId,
        {
          totalSold: s._sum.quantity || 0,
          lastSaleDate: s._max.soldAt,
        },
      ])
    );

    const productData = products.map((product) => {
      const inventory = product.inventory;
      const prediction = predictionMap.get(product.id);
      const sales = salesMap.get(product.id);

      const avgDailySales = sales
        ? (sales.totalSold / DAYS_HISTORY)
        : 0;

      const daysLeft =
        avgDailySales > 0 && inventory
          ? inventory.quantity / avgDailySales
          : null;

      return {
        product,
        inventory,
        prediction,
        sales,
        avgDailySales,
        daysLeft,
      };
    });

    const summary = this.calculateSummary(productData);
    const lowStockItems = this.getLowStockItems(productData);
    const reorderSuggestions = this.getReorderSuggestions(productData);
    const deadStockItems = this.getDeadStockItems(productData);
    const fastMovingItems = this.getFastMovingItems(productData);

    return {
      summary,
      lowStockItems,
      reorderSuggestions,
      deadStockItems,
      fastMovingItems,
    };
  }

  private calculateSummary(productData: any[]): DashboardSummary {
    const totalProducts = productData.length;
    const totalStock = productData.reduce(
      (sum, item) => sum + (item.inventory?.quantity || 0),
      0
    );

    const lowStockCount = productData.filter((item) => {
      if (!item.inventory) return false;
      const atReorderPoint = item.inventory.quantity <= item.inventory.reorderPoint;
      const lowDaysLeft = item.daysLeft !== null && item.daysLeft <= DAYS_LEFT_THRESHOLD;
      return atReorderPoint || lowDaysLeft;
    }).length;

    const deadStockCount = productData.filter((item) => {
      return (
        !item.sales &&
        item.inventory &&
        item.inventory.quantity > 0
      );
    }).length;

    return {
      totalProducts,
      totalStock,
      lowStockCount,
      deadStockCount,
    };
  }

  private getLowStockItems(productData: any[]): LowStockItem[] {
    return productData
      .filter((item) => {
        if (!item.inventory) return false;
        const atReorderPoint = item.inventory.quantity <= item.inventory.reorderPoint;
        const lowDaysLeft = item.daysLeft !== null && item.daysLeft <= DAYS_LEFT_THRESHOLD;
        return atReorderPoint || lowDaysLeft;
      })
      .map((item) => {
        const atReorderPoint = item.inventory.quantity <= item.inventory.reorderPoint;
        const lowDaysLeft = item.daysLeft !== null && item.daysLeft <= DAYS_LEFT_THRESHOLD;

        let reason = "";
        if (atReorderPoint && lowDaysLeft) {
          reason = "Below reorder point and low days left";
        } else if (atReorderPoint) {
          reason = "Below reorder point";
        } else {
          reason = "Low days left";
        }

        return {
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          currentStock: item.inventory.quantity,
          reorderPoint: item.inventory.reorderPoint,
          daysLeft: item.daysLeft !== null ? Number(item.daysLeft.toFixed(1)) : null,
          reason,
        };
      })
      .sort((a, b) => {
        const aDays = a.daysLeft ?? Infinity;
        const bDays = b.daysLeft ?? Infinity;
        return aDays - bDays;
      });
  }

  private getReorderSuggestions(productData: any[]): ReorderSuggestion[] {
    return productData
      .filter((item) => {
        if (!item.inventory) return false;
        const atReorderPoint = item.inventory.quantity <= item.inventory.reorderPoint;
        const lowDaysLeft = item.daysLeft !== null && item.daysLeft <= DAYS_LEFT_THRESHOLD;
        return atReorderPoint || lowDaysLeft;
      })
      .map((item) => {
        const suggestedReorderQty = item.prediction
          ? item.prediction.predictedDemand
          : Math.ceil(item.avgDailySales * 7 + 5);

        return {
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          currentStock: item.inventory.quantity,
          avgDailySales: Number(item.avgDailySales.toFixed(2)),
          daysLeft: item.daysLeft !== null ? Number(item.daysLeft.toFixed(1)) : 0,
          suggestedReorderQty,
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  private getDeadStockItems(productData: any[]): DeadStockItem[] {
    const now = new Date();

    return productData
      .filter((item) => {
        return (
          !item.sales &&
          item.inventory &&
          item.inventory.quantity > 0
        );
      })
      .map((item) => {
        return {
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          currentStock: item.inventory.quantity,
          daysSinceLastSale: DAYS_HISTORY,
        };
      })
      .sort((a, b) => b.currentStock - a.currentStock);
  }

  private getFastMovingItems(productData: any[]): FastMovingItem[] {
    return productData
      .filter((item) => {
        return item.avgDailySales >= FAST_MOVING_THRESHOLD;
      })
      .map((item) => {
        return {
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          currentStock: item.inventory?.quantity || 0,
          avgDailySales: Number(item.avgDailySales.toFixed(2)),
        };
      })
      .sort((a, b) => b.avgDailySales - a.avgDailySales);
  }

  private getEmptyDashboard(): DashboardData {
    return {
      summary: {
        totalProducts: 0,
        totalStock: 0,
        lowStockCount: 0,
        deadStockCount: 0,
      },
      lowStockItems: [],
      reorderSuggestions: [],
      deadStockItems: [],
      fastMovingItems: [],
    };
  }
}

export const dashboardService = new DashboardService();
