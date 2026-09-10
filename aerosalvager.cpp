#include "aerosalvager.h"

void AeroSalvagerSolution::AscendSort()
{
    int i{}, j{};
    /*
    如果多次调用，需要加上
    xOrder.clear();
    yOrder.clear();
    */
    // 插入排序
    for (i = 0; i < coordinate.size(); ++i)
    {
        for (j = 0; j < xOrder.size(); ++j)
        {
            if (coordinate[xOrder[j]].first > coordinate[i].first)
            {
                xOrder.insert(xOrder.begin() + j, i);
                break;
            }
        }
        if (j == xOrder.size())
            xOrder.push_back(i);
    }
    for (i = 0; i < coordinate.size(); ++i)
    {
        for (j = 0; j < yOrder.size(); ++j)
        {
            if (coordinate[yOrder[j]].second > coordinate[i].second)
            {
                yOrder.insert(yOrder.begin() + j, i);
                break;
            }
        }
        if (j == yOrder.size())
            yOrder.push_back(i);
    }
}

AeroSalvagerSolution::Bound AeroSalvagerSolution::Cur_UL_Bounds(int typeIndex, int selected)
{
    Bound curBound{0, 0, 0, 0};
    int i{}, j{}, k{};
    // 对气球分组,j保存进度
    // 计算Lx
    for (i = 0, j = 0; i < balloonType[typeIndex].second - selected; ++i)
        for (; j < xOrder.size(); ++j)
        {
            if (!assignment[xOrder[j]])
            {
                // 该位置未被使用
                curBound.Lx += balloonType[typeIndex].first * coordinate[xOrder[j]].first;
                ++j;
                break;
                // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
            }
        }
    for (i = typeIndex + 1; i < balloonType.size(); ++i)
        for (k = 0; k < balloonType[i].second; ++k)
            for (; j < xOrder.size(); ++j)
            {
                if (!assignment[xOrder[j]])
                {
                    // 该位置未被使用
                    curBound.Lx += balloonType[i].first * coordinate[xOrder[j]].first;
                    ++j;
                    break;
                }
            }
    // 计算Ux
    for (i = 0, j = xOrder.size() - 1; i < balloonType[typeIndex].second - selected; ++i)
        for (; j >= 0; --j)
        {
            if (!assignment[xOrder[j]])
            {
                // 该位置未被使用
                curBound.Ux += balloonType[typeIndex].first * coordinate[xOrder[j]].first;
                --j;
                break;
                // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
            }
        }
    for (i = typeIndex + 1; i < balloonType.size(); ++i)
        for (k = 0; k < balloonType[i].second; ++k)
            for (; j >= 0; --j)
            {
                if (!assignment[xOrder[j]])
                {
                    // 该位置未被使用
                    curBound.Ux += balloonType[i].first * coordinate[xOrder[j]].first;
                    --j;
                    break;
                }
            }
    // 计算Ly
    for (i = 0, j = 0; i < balloonType[typeIndex].second - selected; ++i)
        for (; j < yOrder.size(); ++j)
        {
            if (!assignment[yOrder[j]])
            {
                // 该位置未被使用
                curBound.Ly += balloonType[typeIndex].first * coordinate[yOrder[j]].second;
                ++j;
                break;
                // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
            }
        }
    for (i = typeIndex + 1; i < balloonType.size(); ++i)
        for (k = 0; k < balloonType[i].second; ++k)
            for (; j < yOrder.size(); ++j)
            {
                if (!assignment[yOrder[j]])
                {
                    // 该位置未被使用
                    curBound.Ly += balloonType[i].first * coordinate[yOrder[j]].second;
                    ++j;
                    break;
                }
            }
    // 计算Uy
    for (i = 0, j = yOrder.size() - 1; i < balloonType[typeIndex].second - selected; ++i)
        for (; j >= 0; --j)
        {
            if (!assignment[yOrder[j]])
            {
                // 该位置未被使用
                curBound.Uy += balloonType[typeIndex].first * coordinate[yOrder[j]].second;
                --j;
                break;
                // 实际上对该种类气球不应该再往前放置,现在的做法放宽了上下界,但减少了代码的复杂程度
            }
        }
    for (i = typeIndex + 1; i < balloonType.size(); ++i)
        for (k = 0; k < balloonType[i].second; ++k)
            for (; j >= 0; --j)
            {
                if (!assignment[yOrder[j]])
                {
                    // 该位置未被使用
                    curBound.Uy += balloonType[i].first * coordinate[yOrder[j]].second;
                    --j;
                    break;
                }
            }
    return curBound;
}

bool AeroSalvagerSolution::OuterDFS(int typeIndex)
{
}

bool AeroSalvagerSolution::InnerDFS(int typeIndex, int posIndex, int selected)
{
}
