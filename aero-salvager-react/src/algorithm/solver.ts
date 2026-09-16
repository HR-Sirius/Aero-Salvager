export function solver(balloonType: [number, number][], coordinate: [number, number][]): { success: boolean, assignment: number[] | null } {
    let T_x = 0
    let T_y = 0
    let assignment = new Array(coordinate.length).fill(0)
    let xOrder: number[] = Array.from({ length: coordinate.length }, (_, index) => index)
    let yOrder: number[] = Array.from({ length: coordinate.length }, (_, index) => index)

    xOrder.sort((a, b) => coordinate[a][0] - coordinate[b][0])
    yOrder.sort((a, b) => coordinate[a][1] - coordinate[b][1])
    balloonType.sort((a, b) => b[0] - a[0])

    type Bound = {
        Lx: number
        Ux: number
        Ly: number
        Uy: number
    }

    function Cur_UL_Bounds(typeIndex: number, selected: number): Bound {
        const curBound: Bound = { Lx: 0, Ux: 0, Ly: 0, Uy: 0 }
        let i = 0
        let j = 0
        // 对气球分组,j保存进度
        // 计算Lx
        for (; i < balloonType[typeIndex][1] - selected; ++i)
            for (; j < xOrder.length; ++j) {
                if (!assignment[xOrder[j]]) {
                    // 该位置未被使用
                    curBound.Lx += balloonType[typeIndex][0] * coordinate[xOrder[j]][0];
                    ++j;
                    break;
                    // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
                }
            }
        for (i = typeIndex + 1; i < balloonType.length; ++i)
            for (let k = 0; k < balloonType[i][1]; ++k)
                for (; j < xOrder.length; ++j) {
                    if (!assignment[xOrder[j]]) {
                        // 该位置未被使用
                        curBound.Lx += balloonType[i][0] * coordinate[xOrder[j]][0];
                        ++j;
                        break;
                    }
                }

        // 计算Ux
        for (i = 0, j = xOrder.length - 1; i < balloonType[typeIndex][1] - selected; ++i)
            for (; j >= 0; --j) {
                if (!assignment[xOrder[j]]) {
                    curBound.Ux += balloonType[typeIndex][0] * coordinate[xOrder[j]][0];
                    --j;
                    break;
                }
            }
        for (i = typeIndex + 1; i < balloonType.length; ++i)
            for (let k = 0; k < balloonType[i][1]; ++k)
                for (; j >= 0; --j) {
                    if (!assignment[xOrder[j]]) {
                        curBound.Ux += balloonType[i][0] * coordinate[xOrder[j]][0];
                        --j;
                        break;
                    }
                }

        // 计算Ly
        for (i = 0, j = 0; i < balloonType[typeIndex][1] - selected; ++i)
            for (; j < yOrder.length; ++j) {
                if (!assignment[yOrder[j]]) {
                    // 该位置未被使用
                    curBound.Ly += balloonType[typeIndex][0] * coordinate[yOrder[j]][1];
                    ++j;
                    break;
                    // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
                }
            }
        for (i = typeIndex + 1; i < balloonType.length; ++i)
            for (let k = 0; k < balloonType[i][1]; ++k)
                for (; j < yOrder.length; ++j) {
                    if (!assignment[yOrder[j]]) {
                        // 该位置未被使用
                        curBound.Ly += balloonType[i][0] * coordinate[yOrder[j]][1];
                        ++j;
                        break;
                    }
                }

        // 计算Uy
        for (i = 0, j = yOrder.length - 1; i < balloonType[typeIndex][1] - selected; ++i)
            for (; j >= 0; --j) {
                if (!assignment[yOrder[j]]) {
                    curBound.Uy += balloonType[typeIndex][0] * coordinate[yOrder[j]][1];
                    --j;
                    break;
                }
            }
        for (i = typeIndex + 1; i < balloonType.length; ++i)
            for (let k = 0; k < balloonType[i][1]; ++k)
                for (; j >= 0; --j) {
                    if (!assignment[yOrder[j]]) {
                        curBound.Uy += balloonType[i][0] * coordinate[yOrder[j]][1];
                        --j;
                        break;
                    }
                }
        return curBound
    }
    function OuterDFS(typeIndex: number): boolean // 从typeIndex开始，剩下所有类型能否最终找到完整解
    {
        // 递归终止条件
        if (typeIndex === balloonType.length) {
            if (T_x === 0 && T_y === 0)
                return true;
            else
                return false;
        }
        let posIndex: number = 0
        let selected: number = 0
        return InnerDFS(typeIndex, posIndex, selected);
    }

    function InnerDFS(typeIndex: number, posIndex: number, selected: number): boolean // 继续为当前typeIndex放气球,返回最终所有后续类型也能否成功
    {
        // 如果当前种类气球放完,进行下一类气球递归
        if (selected === balloonType[typeIndex][1])
            return OuterDFS(typeIndex + 1);

        // 先简单剪枝,判断当前种类可悬挂的位置是否大于等于当前气球剩余数量
        let idle_num: number = 0;
        for (let j = posIndex; j < assignment.length; ++j) {
            if (!assignment[j])
                ++idle_num;
        }
        if (idle_num < balloonType[typeIndex][1] - selected)
            return false;
        // 再复杂剪枝,根据上下界判断是否有解
        let curBound = Cur_UL_Bounds(typeIndex, selected);
        if (-T_x < curBound.Lx || -T_x > curBound.Ux)
            return false;
        if (-T_y < curBound.Ly || -T_y > curBound.Uy)
            return false;

        // 剪枝后.对位置进行递归
        for (let j = posIndex; j < assignment.length; ++j) {
            if (!assignment[j]) {
                // 更新状态
                assignment[j] = balloonType[typeIndex][0];
                T_x += balloonType[typeIndex][0] * coordinate[j][0];
                T_y += balloonType[typeIndex][0] * coordinate[j][1];
                // 到最后有解,不用撤回
                if (InnerDFS(typeIndex, j + 1, selected + 1))
                    return true;
                // 否则撤回原状态
                assignment[j] = 0;
                T_x -= balloonType[typeIndex][0] * coordinate[j][0];
                T_y -= balloonType[typeIndex][0] * coordinate[j][1];
            }
        }
        return false;
    }

    if (OuterDFS(0)) {
        return { success: true, assignment: assignment };
    }
    return { success: false, assignment: null };
}