import { useState, useEffect, useRef } from 'react'
import { isCoordSelected, toggleCoords, rowcolToCoords, coordsToRowCol } from './utils/coordinateUtils'
import { solver } from './algorithm/solver';
import './App.css'

function App() {
  const [N, setN] = useState(5);
  const [coord, setCoords] = useState<[number, number][]>([]);
  const [balloonType, setBalloonType] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })
  const [result, setResult] = useState<{ success: boolean, assignment: number[] | null } | null>(null)
  const [solving, setSolving] = useState(false)

  const M = Object.entries(balloonType).reduce((sum, [buoyancy, count]) => sum + Number(buoyancy) * count, 0)
  const workerRef = useRef<Worker | null>(null);

  const handleSolve = () => {
    if (coord.length == 0)
      return
    if (!workerRef.current)
      return
    setSolving(true)
    setResult(null)

    const balloonTypeArray = Object.entries(balloonType).filter((item) => item[1] !== 0).map(([buoyancy, count]) => [Number(buoyancy), count])
    if (balloonTypeArray.length == 0) { alert("请至少输入一种气球的数量"); return }
    workerRef.current.postMessage({ balloonType: balloonTypeArray, coordinate: coord })
  }

  const getBalloonColor = (buoyancy: number): string => {
    switch (buoyancy) {
      case 1: return "#FFF8F0"
      case 2: return "#FFE4CC"
      case 3: return "#FFCCA8"
      case 4: return "#FFAA70"
      case 5: return "#FF8040"
      default: return "#E85020"
    }
  }

  useEffect(() => {
    const worker = new Worker(
      new URL('./algorithm/solver.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;
    worker.onmessage = (event) => {
      const data = event.data
      setResult(data)
      setSolving(false)
    }
    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div>
      <div>{/* 控制区域 */}
        <select value={N}
          disabled={result !== null}
          onChange={(event) => {
            const newN = Number(event.target.value)
            const offset = Math.floor((newN - 1) / 2)
            setCoords(coord.filter((item) => Math.abs(item[0]) <= offset && Math.abs(item[1]) <= offset))
            setN(newN)
          }}
        >
          <option value={3}>N=3</option>
          <option value={5}>N=5</option>
          <option value={7}>N=7</option>
        </select>
      </div>
      <div>{/* 网格容器 */}
        {(result === null) ?
          //编辑模式
          (Array.from({ length: N }).map((_, row) => {
            return <div key={row}>{Array.from({ length: N }).map((_, col) => {
              const [x, y] = rowcolToCoords(row, col, N);
              return (
                <span key={col}
                  style={{ display: 'inline-block', verticalAlign: 'top', boxSizing: 'border-box', width: '60px', height: '60px', border: '1px solid #ccc', textAlign: 'center', lineHeight: '60px', backgroundColor: isCoordSelected(x, y, coord) ? '#a0d8ff' : 'white' }}
                  onClick={() => setCoords(toggleCoords(x, y, coord))}
                >
                  ({x},{y})
                </span>
              )
            })}</div>
          })
          ) : !result.success ?
            (<p>无解</p>) :
            (//结果模式
              Array.from({ length: N }).map((_, row) => {
                return <div key={row}>
                  {
                    Array.from({ length: N }).map((_, col) => {
                      const [x, y] = rowcolToCoords(row, col, N);
                      const index = coord.findIndex((item) => item[0] == x && item[1] == y)
                      const buoyancy = index !== -1 ? result.assignment![index] : 0

                      let bgColor = 'white'
                      let content = ''
                      if (index == -1) {
                        //格子未被选中
                        bgColor = '#e0e0e0';
                      }
                      else {
                        if (buoyancy == 0) {
                          //格子被选中但未放置气球
                          bgColor = '#a0d8ff'
                        }
                        else {
                          //格子放置了气球
                          bgColor = getBalloonColor(buoyancy)
                          content = String(buoyancy)
                        }
                      }
                      return (
                        <span key={col}
                          style={{ display: 'inline-block', verticalAlign: 'top', boxSizing: 'border-box', width: '60px', height: '60px', border: '1px solid #ccc', textAlign: 'center', lineHeight: '60px', backgroundColor: bgColor }}
                        >
                          {content}
                        </span>
                      )
                    })
                  }
                </div>
              })
            )
        }
      </div>
      <div>{/*气球面板容器*/}
        {Object.entries(balloonType).map(([buoyancy, count]) => {
          return (
            <div key={buoyancy}>
              浮力{buoyancy}
              <input type='number'
                value={count}
                onChange={(event) => {
                  let rawCount = event.target.value
                  //if (rawCount.startsWith('0') && rawCount.length > 1)
                  //rawCount = rawCount.replace(/^0+/, '')
                  let newCount = Number(rawCount)
                  if (newCount > 9)
                    newCount = 9
                  if (newCount < 0)
                    newCount = 0
                  setBalloonType({
                    ...(balloonType as Record<number, number>),
                    [Number(buoyancy)]: newCount
                  })
                }}
              >
              </input>
            </div>

          )
        }
        )}
      </div>
      <button
        onClick={handleSolve}
        disabled={solving}
      >
        {solving ? '求解中' : '求解'}
      </button>
      <button
        onClick={() => {
          setResult(null)
          setSolving(false)
        }}
        disabled={!result}
      >
        返回编辑
      </button>
    </div >
  )
}

export default App