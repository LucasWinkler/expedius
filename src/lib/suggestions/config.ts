// Default exploitation to exploration ratio
// For most users, we use 60% exploitation, 40% exploration
export const DEFAULT_EXPLOITATION_RATIO = 0.6;

/**
 * Get a dynamic exploitation ratio based on the user's preference count.
 * As users have more preferences, we increase the exploration ratio
 * to show them more new things they might like.
 */
export const getDynamicExploitationRatio = (
  userPreferencesCount: number,
): number => {
  // Ensure we show more exploration to users with many preferences
  // This is especially important for power users
  if (userPreferencesCount >= 20) {
    return 0.5; // 50% exploitation, 50% exploration for very active users
  }

  // For most users, use the default ratio
  return DEFAULT_EXPLOITATION_RATIO;
};
