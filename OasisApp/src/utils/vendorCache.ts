import { MMKV } from "react-native-mmkv";

// Separate MMKV instance for vendor data caching
const vendorStorage = new MMKV({
  id: "vendor-cache",
});

export interface VendorCacheData {
  imageUrl: string;
  backgroundColor: string | null;
  lastUpdated: number;
}

const VENDOR_CACHE_KEY = "vendor_images_colors";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Cache vendor image and background color data in MMKV for instant access
 */
export const cacheVendorData = (
  vendorName: string,
  imageUrl: string,
  backgroundColor: string | null
): void => {
  try {
    const normalizedName = vendorName.trim().toLowerCase();
    const allData = getAllCachedVendorData();

    allData[normalizedName] = {
      imageUrl: imageUrl || "",
      backgroundColor: backgroundColor || null,
      lastUpdated: Date.now(),
    };

    vendorStorage.set(VENDOR_CACHE_KEY, JSON.stringify(allData));
  } catch (error: any) {
    console.error("Error caching vendor data:", error);
  }
};

/**
 * Cache multiple vendors at once (bulk operation for efficiency)
 */
export const bulkCacheVendorData = (
  vendors: Array<{
    name: string;
    imageUrl: string;
    backgroundColor: string | null;
  }>
): void => {
  try {
    const allData = getAllCachedVendorData();
    const timestamp = Date.now();

    vendors.forEach((vendor) => {
      const normalizedName = vendor.name.trim().toLowerCase();
      allData[normalizedName] = {
        imageUrl: vendor.imageUrl || "",
        backgroundColor: vendor.backgroundColor || null,
        lastUpdated: timestamp,
      };
    });

    vendorStorage.set(VENDOR_CACHE_KEY, JSON.stringify(allData));
    console.log(`✅ Cached ${vendors.length} vendors in MMKV`);
  } catch (error: any) {
    console.error("Error bulk caching vendor data:", error);
  }
};

/**
 * Get cached vendor data for a specific vendor
 */
export const getCachedVendorData = (
  vendorName: string
): VendorCacheData | null => {
  try {
    const normalizedName = vendorName.trim().toLowerCase();
    const allData = getAllCachedVendorData();
    const vendorData = allData[normalizedName];

    if (!vendorData) {
      return null;
    }

    // Check if cache is expired
    const isExpired = Date.now() - vendorData.lastUpdated > CACHE_EXPIRY_MS;
    if (isExpired) {
      console.log(`⚠️ Cache expired for vendor: ${vendorName}`);
      return null;
    }

    return vendorData;
  } catch (error: any) {
    console.error("Error getting cached vendor data:", error);
    return null;
  }
};

/**
 * Get all cached vendor data
 */
export const getAllCachedVendorData = (): Record<string, VendorCacheData> => {
  try {
    const data = vendorStorage.getString(VENDOR_CACHE_KEY);
    if (!data) {
      return {};
    }
    return JSON.parse(data);
  } catch (error: any) {
    console.error("Error getting all cached vendor data:", error);
    return {};
  }
};

/**
 * Clear vendor cache (useful when refreshing stall data)
 */
export const clearVendorCache = (): void => {
  try {
    vendorStorage.delete(VENDOR_CACHE_KEY);
    console.log("✅ Vendor cache cleared");
  } catch (error: any) {
    console.error("Error clearing vendor cache:", error);
  }
};

/**
 * Check if vendor data is cached
 */
export const isVendorCached = (vendorName: string): boolean => {
  const data = getCachedVendorData(vendorName);
  return data !== null;
};

/**
 * Preload vendor data for multiple vendors (useful for order lists)
 */
export const preloadVendorData = (
  vendorNames: string[]
): Map<string, VendorCacheData> => {
  const result = new Map<string, VendorCacheData>();

  vendorNames.forEach((name) => {
    const data = getCachedVendorData(name);
    if (data) {
      result.set(name.trim().toLowerCase(), data);
    }
  });

  return result;
};

/**
 * Get cache statistics
 */
export const getVendorCacheStats = (): {
  totalCached: number;
  expired: number;
  valid: number;
} => {
  try {
    const allData = getAllCachedVendorData();
    const entries = Object.entries(allData);
    const now = Date.now();

    let expired = 0;
    let valid = 0;

    entries.forEach(([_, data]) => {
      if (now - data.lastUpdated > CACHE_EXPIRY_MS) {
        expired++;
      } else {
        valid++;
      }
    });

    return {
      totalCached: entries.length,
      expired,
      valid,
    };
  } catch (error: any) {
    console.error("Error getting cache stats:", error);
    return { totalCached: 0, expired: 0, valid: 0 };
  }
};
