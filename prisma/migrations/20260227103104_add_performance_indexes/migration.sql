-- CreateIndex
CREATE INDEX "inventory_productId_idx" ON "inventory"("productId");

-- CreateIndex
CREATE INDEX "predictions_productId_idx" ON "predictions"("productId");

-- CreateIndex
CREATE INDEX "predictions_productId_createdAt_idx" ON "predictions"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "stores_ownerId_idx" ON "stores"("ownerId");
