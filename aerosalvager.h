/*
Description:给定质量为M的均质正方体及若干浮力不同的气球,
            正方体上表面划分为N*N个方格(N为奇数),部分方格允许挂载气球。
            求一种使正方体平衡上升的气球挂载方案。

Input:划分边长N,允许挂载气球的方格坐标,气球浮力以及对应数量(要求总浮力等于M)
Output:若有解，给出各个气球挂载方格的坐标
*/

/*
算法:两层DFS算法,外层对气球种类进行递归，内层对位置进行递归
*/

#include <iostream>
#include <vector>
#include <utility>
#include <algorithm>
using namespace std;

class AeroSalvagerSolution
{
public:
    AeroSalvagerSolution(const vector<pair<int, int>> &balloonType_input, const vector<pair<int, int>> &coordinate_input)
        : balloonType(balloonType_input),
          coordinate(coordinate_input),
          assignment(coordinate_input.size(), 0)
    {
        AscendSort();
        // 依照ballonType的浮力进行降序排序
        sort(balloonType.begin(), balloonType.end(), [](const pair<int, int> &a, const pair<int, int> &b)
             { return a.first > b.first; });
    }
    virtual ~AeroSalvagerSolution() = default;

    vector<int> Solution(); // 输出答案,即assignment数组

private:
    struct Bound
    {
        int Lx{}; // x方向力矩下界
        int Ux{}; // x方向力矩上界
        int Ly{}; // y方向力矩下界
        int Uy{}; // y方向力矩下界
    };

    void AscendSort();                                        // 将气球可挂载位置的x，y坐标升序排序，保存到xOrder,yOrder
    Bound Cur_UL_Bounds(int typeIndex, int selected);         // 求出当前剩余气球在x，y方向产生力矩的上下界
    bool OuterDFS(int typeIndex);                             // 对气球种类进行递归的外层DFS
    bool InnerDFS(int typeIndex, int posIndex, int selected); // 对可挂载位置进行递归的内层DFS

    vector<pair<int, int>> balloonType{}; // 第一个参数为浮力，第二个为数量
    vector<pair<int, int>> coordinate{};  // 可以挂载气球的坐标x,y
    vector<int> assignment{};             // 长度与coordinate相同,记录对应位置悬挂气球的重量
    int T_x{}, T_y{};                     // 两个方向的力矩和
    vector<int> xOrder{}, yOrder{};       // x,y坐标升序排序后对应下标组成的vector
};
