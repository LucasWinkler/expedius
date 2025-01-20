export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = "An unexpected error occurred",
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(errorMessage);
  }
};
