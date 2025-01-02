import { GridItem } from "../Utils/Gridtype.ts";

export const createInitialGrid = (
    rows: number,
    cols: number,
    goldCount: number,
    bombCount: number,
): GridItem[][] => {
    const totalCells = rows * cols;

    // Ensure at least one gold and bomb remain
    goldCount = Math.min(goldCount, totalCells - 1);
    bombCount = Math.min(bombCount, totalCells - goldCount - 1);

    // Create an array of grid items, first adding gold, then bombs
    const gridItemsArray: GridItem[] = [
        ...Array(goldCount).fill({ type: "gold", revealed: false }),
        ...Array(bombCount).fill({ type: "bomb", revealed: false }),
    ];

    // Add empty cells
    const emptyCellsCount = totalCells - gridItemsArray.length;
    gridItemsArray.push(...Array(emptyCellsCount).fill({ type: 'gold', revealed: false , selected: false }));

    // Shuffle grid items to randomize placement
    for (let i = gridItemsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gridItemsArray[i], gridItemsArray[j]] = [gridItemsArray[j], gridItemsArray[i]];
    }

    // Create the grid from the array of grid items
    const newGrid: GridItem[][] = [];
    for (let i = 0; i < rows; i++) {
        newGrid.push(gridItemsArray.slice(i * cols, (i + 1) * cols));
    }

    return newGrid;
};
