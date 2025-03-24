/**
 * Select items randomly based on their weights
 * @param items Array of items with optional weight property
 * @param count Number of items to select
 * @returns Array of selected items
 */
export function weightedRandomSelection<T extends { weight?: number }>(
  items: T[],
  count: number,
): T[] {
  if (items.length === 0) return [];
  if (items.length <= count) return [...items];

  // Create a copy to avoid modifying the original
  const availableItems = [...items];
  const selected: T[] = [];

  while (selected.length < count && availableItems.length > 0) {
    // Calculate total weight of remaining items
    const totalWeight = availableItems.reduce(
      (sum, item) => sum + (item.weight || 1),
      0,
    );

    // Generate random value between 0 and totalWeight
    const random = Math.random() * totalWeight;

    // Find the item that corresponds to this random value
    let cumulativeWeight = 0;
    let selectedIndex = -1;

    for (let i = 0; i < availableItems.length; i++) {
      cumulativeWeight += availableItems[i].weight || 1;
      if (random <= cumulativeWeight) {
        selectedIndex = i;
        break;
      }
    }

    // If somehow we didn't select anything, take the first item
    if (selectedIndex === -1) selectedIndex = 0;

    // Add to selected array and remove from available items
    selected.push(availableItems[selectedIndex]);
    availableItems.splice(selectedIndex, 1);
  }

  return selected;
}
