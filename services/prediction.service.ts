import { prisma } from "@/lib/prisma";

const DAYS_HISTORY = 30;
const FORECAST_DAYS = 7;
const SAFETY_BUFFER = 5;

interface PredictionResult {
  avgDailySales: number;
  daysLeft: number;
  suggestedReorderQty: number;
  calculatedAt: Date;
}

export class PredictionService {
  async recalculatePrediction(productId: string): Promise<PredictionResult> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.inventory) {
      throw new Error("Inventory not found");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_HISTORY);

    const sales = await prisma.sale.findMany({
      where: {
        productId,
        soldAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const totalSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const avgDailySales = totalSold / DAYS_HISTORY;

    const currentStock = product.inventory.quantity;
    const daysLeft =
      avgDailySales > 0 ? currentStock / avgDailySales : Infinity;

    const suggestedReorderQty = Math.ceil(
      avgDailySales * FORECAST_DAYS + SAFETY_BUFFER
    );

    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + FORECAST_DAYS);

    await prisma.prediction.create({
      data: {
        productId,
        predictedDemand: suggestedReorderQty,
        forecastDate,
      },
    });

    return {
      avgDailySales: Number(avgDailySales.toFixed(2)),
      daysLeft: daysLeft === Infinity ? Infinity : Number(daysLeft.toFixed(2)),
      suggestedReorderQty,
      calculatedAt: new Date(),
    };
  }

  async getPredictionByProductId(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_HISTORY);

    const sales = await prisma.sale.findMany({
      where: {
        productId,
        soldAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const totalSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const avgDailySales = totalSold / DAYS_HISTORY;

    const currentStock = product.inventory?.quantity || 0;
    const daysLeft =
      avgDailySales > 0 ? currentStock / avgDailySales : Infinity;

    const suggestedReorderQty = Math.ceil(
      avgDailySales * FORECAST_DAYS + SAFETY_BUFFER
    );

    const latestPrediction = await prisma.prediction.findFirst({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return {
      avgDailySales: Number(avgDailySales.toFixed(2)),
      daysLeft: daysLeft === Infinity ? Infinity : Number(daysLeft.toFixed(2)),
      suggestedReorderQty,
      calculatedAt: latestPrediction?.createdAt || new Date(),
    };
  }
}

export const predictionService = new PredictionService();
