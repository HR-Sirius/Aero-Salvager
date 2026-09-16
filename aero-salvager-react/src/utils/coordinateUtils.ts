//判断当前点击坐标是否在已选中坐标内
export function isCoordSelected(x: number, y: number, coords: [number, number][]): boolean {
    return coords.some((item) => item[0] === x && item[1] === y);
}

//切换坐标状态
export function toggleCoords(x: number, y: number, coords: [number, number][]): [number, number][] {
    if (isCoordSelected(x, y, coords)) {
        //该坐标已被选中,返回删除该坐标的新数组
        return coords.filter((item) => item[0] !== x || item[1] !== y);
    }
    else {
        //该坐标未被选中，添加该坐标
        return [...coords, [x, y]];
    }
}

//将网页网格位置映射为坐标
export function rowcolToCoords(row: number, col: number, N: number): [number, number] {
    const offset = Math.floor((N - 1) / 2);
    return [col - offset, offset - row];
}

//将坐标映射为网格位置
export function coordsToRowCol(x: number, y: number, N: number): [number, number] {
    const offset = Math.floor((N - 1) / 2);
    return [offset - y, x + offset];
}