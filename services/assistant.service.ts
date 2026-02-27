import { prisma } from "@/lib/prisma";
import { DashboardService } from "./dashboard.service";

type Intent =
  | "reorder"
  | "risk"
  | "deadstock"
  | "fastmoving"
  | "summary"
  | "unknown";

interface AssistantResponse {
  answer: string;
  data?: any;
}

export class AssistantService {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async handleQuery(
    storeId: string,
    question: string
  ): Promise<AssistantResponse> {
    const intent = this.detectIntent(question);
    const dashboardData = await this.dashboardService.getDashboardData(storeId);

    switch (intent) {
      case "reorder":
        return this.buildReorderResponse(dashboardData);
      case "risk":
        return this.buildRiskResponse(dashboardData);
      case "deadstock":
        return this.buildDeadStockResponse(dashboardData);
      case "fastmoving":
        return this.buildFastMovingResponse(dashboardData);
      case "summary":
        return this.buildSummaryResponse(dashboardData);
      default:
        return this.buildUnknownResponse();
    }
  }

  private detectIntent(question: string): Intent {
    const q = question.toLowerCase().trim();

    // Reorder intent
    if (
      q.includes("reorder") ||
      q.includes("order") ||
      q.includes("buy") ||
      q.includes("purchase") ||
      q.includes("stock up")
    ) {
      return "reorder";
    }

    // Risk/Low stock intent
    if (
      q.includes("risk") ||
      q.includes("low stock") ||
      q.includes("running out") ||
      q.includes("stockout") ||
      q.includes("almost empty")
    ) {
      return "risk";
    }

    // Dead stock intent
    if (
      q.includes("dead") ||
      q.includes("not selling") ||
      q.includes("slow moving") ||
      q.includes("stagnant") ||
      q.includes("unused")
    ) {
      return "deadstock";
    }

    // Fast moving intent
    if (
      q.includes("fast") ||
      q.includes("best") ||
      q.includes("top") ||
      q.includes("popular") ||
      q.includes("selling well") ||
      q.includes("high demand")
    ) {
      return "fastmoving";
    }

    // Summary intent
    if (
      q.includes("summary") ||
      q.includes("overview") ||
      q.includes("status") ||
      q.includes("how") ||
      q.includes("doing")
    ) {
      return "summary";
    }

    return "unknown";
  }

  private buildReorderResponse(data: any): AssistantResponse {
    const { reorderSuggestions } = data;

    if (reorderSuggestions.length === 0) {
      return {
        answer: "You don't need to reorder anything today. All stock levels are healthy.",
        data: { count: 0, items: [] },
      };
    }

    const topItems = reorderSuggestions.slice(0, 5);
    const itemsList = topItems
      .map(
        (item: any) =>
          `- ${item.name} (SKU: ${item.sku}): Reorder ${item.suggestedReorderQty} units (${item.daysLeft} days left)`
      )
      .join("\n");

    return {
      answer: `You should reorder ${reorderSuggestions.length} products today:\n\n${itemsList}`,
      data: {
        count: reorderSuggestions.length,
        items: reorderSuggestions,
      },
    };
  }

  private buildRiskResponse(data: any): AssistantResponse {
    const { lowStockItems } = data;

    if (lowStockItems.length === 0) {
      return {
        answer: "No products are currently at risk. All stock levels are adequate.",
        data: { count: 0, items: [] },
      };
    }

    const criticalItems = lowStockItems.filter(
      (item: any) => item.daysLeft !== null && item.daysLeft <= 3
    );

    const itemsList = criticalItems
      .slice(0, 5)
      .map(
        (item: any) =>
          `- ${item.name} (SKU: ${item.sku}): ${item.currentStock} units left, ${item.daysLeft} days remaining`
      )
      .join("\n");

    return {
      answer: `${lowStockItems.length} products are at risk of running out:\n\n${itemsList}${
        criticalItems.length > 5 ? "\n\n...and more" : ""
      }`,
      data: {
        count: lowStockItems.length,
        critical: criticalItems.length,
        items: lowStockItems,
      },
    };
  }

  private buildDeadStockResponse(data: any): AssistantResponse {
    const { deadStockItems } = data;

    if (deadStockItems.length === 0) {
      return {
        answer: "No dead stock detected. All products are selling regularly.",
        data: { count: 0, items: [] },
      };
    }

    const itemsList = deadStockItems
      .slice(0, 5)
      .map(
        (item: any) =>
          `- ${item.name} (SKU: ${item.sku}): ${item.currentStock} units, ${item.daysSinceLastSale} days since last sale`
      )
      .join("\n");

    return {
      answer: `${deadStockItems.length} products are dead stock:\n\n${itemsList}${
        deadStockItems.length > 5 ? "\n\n...and more" : ""
      }`,
      data: {
        count: deadStockItems.length,
        items: deadStockItems,
      },
    };
  }

  private buildFastMovingResponse(data: any): AssistantResponse {
    const { fastMovingItems } = data;

    if (fastMovingItems.length === 0) {
      return {
        answer: "No fast-moving products identified yet. Need more sales data.",
        data: { count: 0, items: [] },
      };
    }

    const itemsList = fastMovingItems
      .slice(0, 5)
      .map(
        (item: any) =>
          `- ${item.name} (SKU: ${item.sku}): ${item.avgDailySales.toFixed(1)} units/day average`
      )
      .join("\n");

    return {
      answer: `Your top ${fastMovingItems.length} fast-moving products:\n\n${itemsList}`,
      data: {
        count: fastMovingItems.length,
        items: fastMovingItems,
      },
    };
  }

  private buildSummaryResponse(data: any): AssistantResponse {
    const { summary } = data;

    return {
      answer: `Inventory Summary:\n\n- Total Products: ${summary.totalProducts}\n- Total Stock: ${summary.totalStock} units\n- Low Stock Alerts: ${summary.lowStockCount}\n- Dead Stock Items: ${summary.deadStockCount}\n\nOverall status: ${
        summary.lowStockCount === 0 ? "Healthy ✓" : "Needs attention"
      }`,
      data: summary,
    };
  }

  private buildUnknownResponse(): AssistantResponse {
    return {
      answer:
        "I can help you with:\n\n- Reorder suggestions\n- Risk analysis\n- Dead stock identification\n- Fast-moving products\n- Inventory summary\n\nPlease ask a specific question about your inventory.",
      data: null,
    };
  }
}

export const assistantService = new AssistantService();
