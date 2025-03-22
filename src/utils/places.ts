export const formatPlaceType = ({
  type,
  capitalize = false,
}: {
  type: string;
  capitalize?: boolean;
}) => {
  return capitalize
    ? type
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : type.replace(/_/g, " ");
};

export const formatBooleanFeatures = (
  data: Record<string, unknown>,
  features: ReadonlyArray<{ key: string; label: string }>,
) => {
  return features
    .filter(({ key }) => {
      const value = key
        .split(".")
        .reduce<unknown>(
          (acc, k) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[k]
              : undefined,
          data,
        );

      return typeof value === "boolean" && value === true;
    })
    .map(({ label }) => label);
};
