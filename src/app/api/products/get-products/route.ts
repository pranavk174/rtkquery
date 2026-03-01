import { NextResponse } from "next/server";
import ProductModel from "@/dbModels/ProductModels";
import { dbConnect } from "@/utilities/db";

// Types for better type safety
interface QueryParams {
  limit: number;
  skip: number;
  category?: string | null;
  brand?: string | null;
  title?: string | null;
}

interface APIResponse {
  message: string;
  products: any[];
  total: number;
  categories: string[];
  brands: string[];
  titles: string[];
}

interface APIError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// Validation helper
function validateQueryParams(searchParams: URLSearchParams): { isValid: boolean; error?: string; params?: QueryParams } {
  const limitParam = searchParams.get("limit");
  const skipParam = searchParams.get("skip");

  // Convert and validate limit
  const limit = limitParam ? Number(limitParam) : 10;
  if (isNaN(limit) || limit <= 0 || limit > 100) {
    return { isValid: false, error: "limit must be a positive number between 1 and 100" };
  }

  // Convert and validate skip
  const skip = skipParam ? Number(skipParam) : 0;
  if (isNaN(skip) || skip < 0) {
    return { isValid: false, error: "skip must be a non-negative number" };
  }

  const category = searchParams.get("category");
  const title = searchParams.get("title");
  const brand = searchParams.get("brand");

  return {
    isValid: true,
    params: {
      limit,
      skip,
      category: category === "null" ? null : category,
      brand: brand === "null" ? null : brand,
      title: title === "null" ? null : title,
    }
  };
}

// Database filter builder
function buildDatabaseFilter(params: QueryParams): any {
  const filter: any = {};

  if (params.category && params.category !== "null") {
    filter.category = params.category;
  }

  if (params.brand && params.brand !== "null") {
    filter.brand = params.brand;
  }

  if (params.title && params.title !== "null") {
    filter.title = { $regex: params.title, $options: "i" };
  }

  return filter;
}

// Error response helper
function createErrorResponse(message: string, code: string, status: number, details?: any): NextResponse {
  const error: APIError = {
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };

  console.error(`[API Error] ${code}: ${message}`, details);

  return NextResponse.json(error, { status });
}

export const GET = async (req: Request) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const { searchParams } = new URL(req.url);

    // Log request details for debugging
    console.log(`[${requestId}] API Request - URL: ${req.url}`);
    console.log(`[${requestId}] Query params:`, Object.fromEntries(searchParams.entries()));

    // Validate query parameters
    const validation = validateQueryParams(searchParams);
    if (!validation.isValid) {
      return createErrorResponse(
        validation.error!,
        "INVALID_PARAMS",
        400,
        { receivedParams: Object.fromEntries(searchParams.entries()) }
      );
    }

    const params = validation.params!;
    console.log(`[${requestId}] Validated params:`, params);

    // Establish database connection
    try {
      await dbConnect();
      console.log(`[${requestId}] Database connection established`);
    } catch (dbError) {
      console.error(`[${requestId}] Database connection failed:`, dbError);
      return createErrorResponse(
        "Database connection failed",
        "DB_CONNECTION_ERROR",
        503,
        { retryAfter: 30 }
      );
    }

    // Build database filter
    const filter = buildDatabaseFilter(params);
    console.log(`[${requestId}] Database filter:`, filter);

    // Execute database queries
    try {
      const [data, total, categories, brands, titles] = await Promise.all([
        ProductModel.find(filter).limit(params.limit).skip(params.skip).lean(),
        ProductModel.countDocuments(filter),
        ProductModel.distinct("category"),
        ProductModel.distinct("brand"),
        ProductModel.distinct("title")
      ]);

      const queryTime = Date.now() - startTime;
      console.log(`[${requestId}] Query completed in ${queryTime}ms - Found ${data.length} products`);

      // Handle empty results consistently
      if (data.length === 0) {
        const response: APIResponse = {
          message: "No products found matching the criteria",
          products: [],
          total: 0,
          categories: categories || [],
          brands: brands || [],
          titles: titles || []
        };

        console.log(`[${requestId}] Returning empty result set`);
        return NextResponse.json(response);
      }

      // Return successful response
      const response: APIResponse = {
        message: "Products fetched successfully",
        products: data,
        total: total || 0,
        categories: categories || [],
        brands: brands || [],
        titles: titles || []
      };

      console.log(`[${requestId}] Success response - ${data.length} products, ${total} total`);
      return NextResponse.json(response);

    } catch (queryError) {
      console.error(`[${requestId}] Database query failed:`, queryError);
      return createErrorResponse(
        "Database query failed",
        "DB_QUERY_ERROR",
        500,
        { filter, params }
      );
    }

  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[${requestId}] Unexpected error after ${errorTime}ms:`, error);

    return createErrorResponse(
      "Internal server error",
      "INTERNAL_ERROR",
      500,
      { requestId, errorTime }
    );
  }
};
