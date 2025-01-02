

export const cellBackgroundGradient = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, 'rgb(87, 108, 117)');
    gradient.addColorStop(1, 'rgb(37, 50, 55)');
    return gradient;
};
