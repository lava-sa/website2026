export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { parseFunnelConfig, type FunnelStepConfig } from "@/lib/funnel";

function toMapById<T extends { id: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.id, row]));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: sourceProduct, error: sourceError } = await supabase
    .from("products")
    .select("id, name, slug, specs")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (sourceError || !sourceProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const config = parseFunnelConfig(sourceProduct.specs?.funnel_config);
  if (!config.enabled) {
    return NextResponse.json({ enabled: false, steps: [] });
  }

  const allIds = Array.from(
    new Set(config.steps.flatMap((step) => step.productIds).filter(Boolean))
  );

  if (allIds.length === 0) {
    return NextResponse.json({ enabled: true, steps: [] });
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug, regular_price, sale_price, primary_image_url, sku, stock_status, is_published")
    .in("id", allIds)
    .eq("is_published", true);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  const byId = toMapById(products ?? []);
  const steps = (config.steps as FunnelStepConfig[])
    .map((step, idx) => ({
      index: idx,
      title: step.title,
      description: step.description,
      discountPercent: step.discountPercent,
      products: step.productIds
        .map((id) => byId.get(id))
        .filter(Boolean),
    }))
    .filter((step) => step.products.length > 0);

  return NextResponse.json({
    enabled: true,
    sourceProduct: { id: sourceProduct.id, slug: sourceProduct.slug, name: sourceProduct.name },
    steps,
  });
}
