import { productApi, productApiUtil } from '@/redux/services/apiServices';
import { store } from '@/redux/store';
import { productResponse } from '@/redux/types';

// Cache hydration utilities
export interface CacheHydrationOptions {
    queryArgs: {
        limit: number;
        skip: number;
        category?: string | null;
        brand?: string | null;
        title?: string | null;
    };
    data: productResponse;
}

/**
 * Hydrate RTK Query cache with SSR data
 * This prevents duplicate API calls on initial render
 */
export function hydrateProductsCache(options: CacheHydrationOptions) {
    const { queryArgs, data } = options;

    //  console.log('🔄 Hydrating RTK Query cache with SSR data:', { queryArgs, dataLength: data.products?.length });

    try {
        // Dispatch the cache hydration action
        store.dispatch(
            productApi.util.upsertQueryData('getProducts', queryArgs, data)
        );

        //  console.log('✅ RTK Query cache hydrated successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to hydrate RTK Query cache:', error);
        return false;
    }
}

/**
 * Check if data exists in RTK Query cache
 */
export function isCacheHydrated(queryArgs: CacheHydrationOptions['queryArgs']): boolean {
    const state = store.getState();
    const cacheEntry = productApi.endpoints.getProducts.select(queryArgs)(state);

    const isHydrated = cacheEntry.isSuccess && cacheEntry.data && cacheEntry.data.products.length > 0;
    //  console.log('🔍 Cache hydration check:', { queryArgs, isHydrated, hasData: !!cacheEntry.data });

    return isHydrated;
}

/**
 * Clear RTK Query cache for products
 */
export function clearProductsCache() {
    //  console.log('🗑️ Clearing RTK Query products cache');
    store.dispatch(productApi.util.resetApiState());
}

/**
 * Prefill cache with initial data and prevent duplicate requests
 */
export function prefillCacheAndPreventDuplicates(
    queryArgs: CacheHydrationOptions['queryArgs'],
    ssrData: productResponse
) {
    // Check if cache is already hydrated
    if (isCacheHydrated(queryArgs)) {
        //  console.log('⚡ Cache already hydrated, skipping');
        return false;
    }

    // Hydrate cache with SSR data
    const success = hydrateProductsCache({ queryArgs, data: ssrData });

    if (success) {
        //  console.log('🎯 Cache prefilled successfully, RTK Query will use cached data');
    }

    return success;
}