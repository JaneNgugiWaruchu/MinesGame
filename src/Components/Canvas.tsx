import React, {useEffect, useCallback, useState} from "react";
import goldDiamondImg from "../assets/img/diamond.png";
import bombDiamondImg from "../assets/img/bomb.png";
import {GameState} from "../Utils/Gridtype.ts";

interface CanvasProps {
    rows: number,
    cols: number,
    gap: number,
    autoBet: boolean,
    cellWidth: number,
    cellHeight: number,
    gridItems: GameState["gridItems"],
    gridRevealed: boolean,
    handleCanvasClick: (event: MouseEvent) => void,
    gameState:GameState,
}

const Canvas: React.FC<CanvasProps> = ({
                                           rows,
                                           cols,
                                           gap,
                                           cellWidth,
                                           cellHeight,
                                           gridItems,
                                           autoBet,
                                           gridRevealed,
                                           handleCanvasClick,
                                           gameState,
                                       }) => {
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);


    const drawGrid = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            if (!gridItems || gridItems.length === 0) return;
            const borderRadius = 10;
            ctx.clearRect(0, 0, 650, 650);
            ctx.fillStyle = 'rgb(15,33,46)';
            ctx.fillRect(0, 0, 650, 650);
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const cell = gridItems[row]?.[col];
                    if (!cell) continue;
                    const x = gap + col * (cellWidth + gap);
                    const y = gap + row * (cellHeight + gap);
                    const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                    const isRevealed = cell.revealed || gridRevealed;
                    const isSelected = cell.selected;

                    ctx.shadowBlur = isHovered ? 10 : 0;
                    ctx.shadowColor = isHovered ? "rgba(0, 0, 0, 0.5)" : "transparent";
                    ctx.fillStyle = 'transparent';
                    ctx.fillRect(0, 0, 650, 650);
                    ctx.fillStyle = 'rgb(47,69,83)';

                    if (!isRevealed && isHovered) {
                        ctx.fillStyle = 'rgb(96, 136, 161,.7)';
                        ctx.save();
                        ctx.translate(x + cellWidth / 2, y + cellHeight / 2);
                        ctx.scale(1.02, 1.035);
                        ctx.translate(-(x + cellWidth / 2), -(y + cellHeight / 2));
                    }
                    ctx.shadowColor = 'rgb(33,55,67)';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 3;

                    ctx.beginPath();
                    ctx.moveTo(x + borderRadius, y);
                    ctx.arcTo(x + cellWidth, y, x + cellWidth, y + cellHeight, borderRadius);
                    ctx.arcTo(x + cellWidth, y + cellHeight, x, y + cellHeight, borderRadius);
                    ctx.arcTo(x, y + cellHeight, x, y, borderRadius);
                    ctx.arcTo(x, y, x + cellWidth, y, borderRadius);
                    ctx.closePath();
                    ctx.fill();

                    if (isHovered) {
                        ctx.restore();
                    }
                    if (isRevealed) {
                        ctx.fillStyle = 'transparent';
                        ctx.shadowColor = autoBet
                            ? (isRevealed ? (cell.type === 'gold' ? 'rgb(95,6,190,.75)' : 'red') : '')
                            : (isRevealed ? '' : 'rgb(33,55,67)');
                    } else {
                        ctx.shadowColor = !autoBet ? 'rgb(33,55,67)' : 'rgb(33,55,67)';
                    }


                    if(gameState.selectedCells){
                        // ctx.fillStyle = 'rgb(47,69,83)';
                        // ctx.shadowColor = 'rgb(33,55,67)';
                        // ctx.shadowBlur = 0;
                        // ctx.shadowOffsetX = 0;
                        // ctx.shadowOffsetY = 4;
                        // ctx.save();
                        // ctx.fill();

                        if (isRevealed && cell.type) {
                                const padding = 10;
                                const paddedX = x + padding;
                                const paddedY = y + padding;
                                const paddedWidth = cellWidth - padding * 2;
                                const paddedHeight = cellHeight - padding * 2;

                                ctx.fillStyle = cell.type === "gold" ? '#1F2030' : '#6E260E';
                                ctx.shadowColor=cell.type === "gold" ?'#39f400':'#FF2650';
                                ctx.strokeStyle = cell.type === "gold" ? "#39f400" : cell.type === "bomb" ? "red" : "transparent";
                                ctx.lineWidth = 0.8;
                                ctx.shadowBlur = 0;
                                ctx.shadowOffsetX = 0;
                                ctx.shadowOffsetY = 4;
                                ctx.stroke();
                                ctx.fill();
                                ctx.save();
                                const img = new Image();
                                img.src = cell.type === "gold" ? goldDiamondImg : bombDiamondImg;
                                img.onload = () => {
                                    ctx.shadowBlur=0;
                                    ctx.shadowColor=cell.type === "gold" ?'transparent':'red';
                                    ctx.drawImage(img, paddedX, paddedY, paddedWidth, paddedHeight);
                                };
                        }
                    }
                    else{
                        if (isRevealed && cell.type) {
                            const padding = 10;
                            const paddedX = x + padding;
                            const paddedY = y + padding;
                            const paddedWidth = cellWidth - padding * 2;
                            const paddedHeight = cellHeight - padding * 2;

                            ctx.fillStyle = cell.type === "gold" ? '#1F2030' : '#6E260E';

                            ctx.shadowColor=cell.type === "gold" ?'yellow':'#FF2650';
                            ctx.strokeStyle = cell.type === "gold" ? "yellow" : cell.type === "bomb" ? "red" : "transparent";
                            ctx.lineWidth = 0.8;
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 4;
                            ctx.stroke();
                            ctx.fill();
                            ctx.save();
                            const img = new Image();
                            img.src = cell.type === "gold" ? goldDiamondImg : bombDiamondImg;
                            img.onload = () => {
                                ctx.shadowBlur=0;
                                ctx.shadowColor=cell.type === "gold" ?'transparent':'red';
                                ctx.drawImage(img, paddedX, paddedY, paddedWidth, paddedHeight);
                            };
                        }
                    }

                    if (autoBet) {
                        if (isSelected) {
                            ctx.fillStyle = 'yellow';
                            ctx.shadowColor = '#FFD700';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 5;
                            ctx.save();
                            ctx.fill();

                            if (isRevealed && cell.type) {
                                const padding = 10;
                                const paddedX = x + padding;
                                const paddedY = y + padding;
                                const paddedWidth = cellWidth - padding * 2;
                                const paddedHeight = cellHeight - padding * 2;
                                ctx.save();
                                ctx.fillStyle = cell.type === "gold" ? "black" : '#6E260E';
                                ctx.strokeStyle = cell.type === "gold" ? "yellow" :"yellow";
                                ctx.shadowColor = cell.type === "gold" ? 'transparent' : '#FFBF00';
                                ctx.shadowBlur = 0;
                                ctx.shadowOffsetX = 0;
                                ctx.shadowOffsetY = 4;
                                ctx.lineWidth = 4;
                                ctx.stroke();
                                ctx.fill();

                                const img = new Image();
                                img.src = cell.type === "gold" ? goldDiamondImg : bombDiamondImg;
                                img.onload = () => {
                                    ctx.shadowColor = cell.type === "gold" ? 'transparent' : 'red';
                                    ctx.drawImage(img, paddedX, paddedY, paddedWidth, paddedHeight);
                                };
                            }
                        }

                        else{
                            if(isRevealed){
                                ctx.fillStyle = cell.type === "gold" ? '#1F2030' : '#6E260E';
                                ctx.shadowColor=cell.type === "gold" ?'green':'darkred';
                                ctx.strokeStyle = cell.type === "gold" ? "green" : cell.type === "bomb" ? "darkred" : "transparent";
                                ctx.lineWidth = 0.8;
                                ctx.shadowBlur = 0;
                                ctx.shadowOffsetX = 0;
                                ctx.shadowOffsetY = 4;
                                ctx.stroke();
                                ctx.fill();
                                ctx.save();

                                const drawRoundedRect = (x:number, y: number, width:number, height :number, radius:number) => {
                                        ctx.beginPath();
                                        ctx.moveTo(x + radius, y);
                                        ctx.arcTo(x + width, y, x + width, y + height, radius);
                                        ctx.arcTo(x + width, y + height, x, y + height, radius);
                                        ctx.arcTo(x, y + height, x, y, radius);
                                        ctx.arcTo(x, y, x + width, y, radius);
                                        ctx.closePath();
                                        ctx.fill();
                                    };
                                const padding = 0;
                                const paddedX = x + padding;
                                const paddedY = y + padding;
                                const paddedWidth = cellWidth - padding * 2;
                                const paddedHeight = cellHeight - padding * 2;
                                // image padding
                                const paddingws = 10;
                                const paddedx = x + paddingws;
                                const paddedy = y + paddingws;
                                const paddedwidth = cellWidth - paddingws * 2;
                                const paddedheight = cellHeight - paddingws * 2;
                                const img = new Image();
                                const overlayBorderRadius = 15;
                                img.src = cell.type === "gold" ? goldDiamondImg : bombDiamondImg;
                                img.onload = () => {
                                    ctx.shadowColor = cell.type === "gold" ? 'transparent' : 'red';
                                    ctx.drawImage(img, paddedx, paddedy, paddedwidth, paddedheight);
                                    ctx.save();
                                    ctx.fillStyle = cell.type === "gold" ? 'rgba(0, 0, 0, 0.5)' : 'transparent'; // Black with slight transparency
                                    drawRoundedRect(paddedX, paddedY, paddedWidth, paddedHeight, overlayBorderRadius);
                                    ctx.restore();
                                };
                                }
                        }

                    }

                }
            }
        },
        [gridItems, rows, cols, cellWidth, cellHeight, hoveredCell?.row, hoveredCell?.col, gridRevealed]
    );

    const handleMouseMove = (event: MouseEvent) => {
        const canvas = document.getElementById("minesCanvas") as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        const col = Math.floor((x - gap) / (cellWidth + gap));
        const row = Math.floor((y - gap) / (cellHeight + gap));

        if (col >= 0 && col < cols && row >= 0 && row < rows) {
            const cell = gridItems[row]?.[col];
            const isRevealed = cell.revealed || gridRevealed;
            if (!isRevealed && (!hoveredCell || hoveredCell.row !== row || hoveredCell.col !== col)) {
                setHoveredCell({row, col});
            }
        } else {
            setHoveredCell(null);
        }
    };

    useEffect(() => {
        const canvas = document.getElementById("minesCanvas") as HTMLCanvasElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        drawGrid(ctx);

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseout", () => setHoveredCell(null));
        canvas.addEventListener("click", handleCanvasClick);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseout", () => setHoveredCell(null));
            canvas.removeEventListener("click", handleCanvasClick);
        };
    }, [drawGrid, handleMouseMove, handleCanvasClick]);

    return <canvas id="minesCanvas" width={650} height={650}/>;
};

export default Canvas;