
import {useCallback} from "react";
import {GameState, GridItem} from "../Utils/Gridtype.ts";

export const useHandelCanvasClick =(
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gridItems: GridItem[][],
    cellWidth: number,
    cellHeight: number,
    cols: number,
    rows: number,
    gap: number,
    multiplier: number,
    goldDiamondImg: string
)=>{
    return useCallback(
        (event: MouseEvent) => {
            if (!gameState.gameActive) return;
            const canvas = event.target as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
            const [x, y] = [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
            const [col, row] = [Math.floor((x - gap) / (cellWidth + gap)), Math.floor((y - gap) / (cellHeight + gap))];

            if( !gameState.autoBet){

                if (col < 0 || col >= cols || row < 0 || row >= rows) return;

                const cell = gridItems[row][col];
                if (!cell || cell.revealed) return;

                setGameState((prev) => {
                    const newSelectedCells = prev.gridItems[row][col].selected
                        ? prev.selectedCells.filter(cell => cell !== prev.gridItems[row][col])
                        : [...prev.selectedCells, prev.gridItems[row][col]];
                    gameState.selectedCells = newSelectedCells;
                    return {
                        ...prev,
                        gridItems: prev.gridItems.map((rowItems, r) =>
                            r === row
                                ? rowItems.map((item, c) =>
                                    c === col
                                        ? { ...item, selected: !item.selected } : item
                                )
                                : rowItems
                        ),
                        selectedCells: newSelectedCells,
                    };
                });


                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const cellX = gap + col * (cellWidth + gap), cellY = gap + row * (cellHeight + gap);

                const animate = (imgSrc: string, duration: number, callback?: () => void) => {
                    const img = new Image();
                    img.src = imgSrc;
                    const startTime = performance.now();

                    img.onload = () => {
                        const animateFrame = (time: number) => {
                            const scale = Math.min((time - startTime) / duration, 1.1);
                            const [scaledWidth, scaledHeight] = [cellWidth * scale, cellHeight * scale];
                            const [offsetX, offsetY] = [(cellWidth - scaledWidth) / 2, (cellHeight - scaledHeight) / 2];

                            ctx.clearRect(cellX, cellY, cellWidth, cellHeight);
                            ctx.drawImage(img, cellX + offsetX, cellY + offsetY, scaledWidth, scaledHeight);

                            if (scale < 1) requestAnimationFrame(animateFrame);
                            else callback?.();
                        };
                        requestAnimationFrame(animateFrame);
                    };
                };

                if (cell.type === "bomb") {
                    setGameState(prev => ({
                        ...prev,
                        gameActive: false,
                        gridItems: gridItems.map(row => row.map(cell => ({ ...cell, revealed: true }))),
                    }));
                    setTimeout( () => {
                        setGameState(prev => ({ ...prev,  gridItems: gridItems.map(row => row.map(cell => ({ ...cell, revealed: false }))),}));
                    }, 2000);
                    return;
                }
                const rippleStartTime = performance.now();
                const animateRipple = (time: number) => {
                    const rippleProgress = Math.min((time - rippleStartTime) / 100, 2.5);
                    const rippleSize = Math.max(cellWidth * rippleProgress, 1.2);

                    ctx.clearRect(cellX, cellY, cellWidth, cellHeight);
                    ctx.beginPath();
                    ctx.arc(cellX + cellWidth / 2, cellY + cellHeight / 2, rippleSize / 2, 0, Math.PI * 2);
                    ctx.fill();

                    if (rippleProgress < 1) {
                        requestAnimationFrame(animateRipple);
                    } else {
                        animate(cell.type === "gold" ? goldDiamondImg : "", 25, () => {
                            setGameState(prev => ({
                                ...prev,
                                gridItems: gridItems.map((rowItems, r) =>
                                    r === row ? rowItems.map((item, c) => (c === col ? { ...cell, revealed: true } : item)) : rowItems
                                ),
                                multiplier: prev.multiplier+ multiplier,
                                revealedCount: prev.revealedCount + 1,
                            }));
                            console.log(multiplier);
                            console.log(gameState.multiplier);
                        });
                    }
                };
                requestAnimationFrame(animateRipple);
            }
            else {
                const cell = gridItems[row][col];
                if (!cell || cell.revealed) return;
                if (col >= 0 && col < cols && row >= 0 && row < rows) {
                    const clickedCell = gridItems[row]?.[col];
                    // You can perform actions on the clicked cell here
                    console.log("Clicked cell:", clickedCell);
                    // For example, reveal the clicked cell
                    // clickedCell.revealed = true;
                }
                setGameState((prev) => ({
                    ...prev,
                    gridItems: prev.gridItems.map((rowItems, r) =>
                        r === row
                            ? rowItems.map((item, c) =>
                                c === col
                                    ? {
                                        ...item,
                                        selected: !item.selected,
                                    }: item
                            ): rowItems
                    ),
                }));
            }
            },
        [gameState.gameActive, gameState.multiplier, gap, cellWidth, cellHeight, cols, rows, gridItems, setGameState, goldDiamondImg, multiplier]
    );
};
//
// export const startAutoBet = () => {
//     if( !gameState.autoBet){
//         const canvas = event.target as HTMLCanvasElement;
//         const rect = canvas.getBoundingClientRect();
//         const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
//         const [x, y] = [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
//         const [col, row] = [Math.floor((x - gap) / (cellWidth + gap)), Math.floor((y - gap) / (cellHeight + gap))];
//
//         setGameState((prev) => ({ ...prev, resultOverlay: false }));
//         resetGame();
//         setGameState((prev: GameState) => ({
//             ...prev,
//             gameActive: true,
//             gridRevealed: false,
//             multiplier: 1,
//             revealedCount: 0,
//         }));
//         setGameState((prev) => ({
//             ...prev,
//             gridItems: prev.gridItems.map((rowItems, r) =>
//                 r === gameState.rows
//                     ? rowItems.map((item, c) =>
//                         c === gameState.cols
//                             ? {
//                                 ...item,
//                                 selected: !item.selected,
//                             }: item
//                     ): rowItems
//             ),
//         }));
//     }
//
// };
