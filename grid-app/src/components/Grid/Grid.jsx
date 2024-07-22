import React, { useEffect, useState } from 'react';
import './grid.css';
import { intitalGridConfig } from './gridData';

function Grid() {
  const [gridConfig, setGridConfig] = useState(intitalGridConfig);
  const [allActiveCellsClicked, setAllActiveCellsClicked] = useState(false);
  const [orderOfClicking, setOrderOfClicking] = useState([]);
  const [pointerEventsEnabled, setPointerEventsEnabled] = useState(true);

  const delayHandler = (clickedCell, delay) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setGridConfig((prev) =>
          prev.map((rowCells, ri) => {
            return rowCells.map((cell, ci) => {
              if (ri === clickedCell[0] && ci === clickedCell[1]) {
                return 1;
              } else {
                return cell;
              }
            });
          })
        );
        resolve();
      }, delay);
    });

  const handleReverseToInitialState = async () => {
    setPointerEventsEnabled(false);
    for (let i = orderOfClicking.length - 1; i >= 0; i--) {
      await delayHandler(orderOfClicking[i], 1000);
    }
    setOrderOfClicking([]);
    setAllActiveCellsClicked(false);
    setPointerEventsEnabled(true);
  };

  useEffect(() => {
    if (allActiveCellsClicked) {
      handleReverseToInitialState();
    }
  }, [allActiveCellsClicked]);

  useEffect(() => {
    const isAllActiveCellsClicked = gridConfig
      .flat()
      .every((cell) => cell !== 1);
    setAllActiveCellsClicked(isAllActiveCellsClicked);
  }, [gridConfig]);

  console.log(
    'orderOfClicking-->',
    orderOfClicking,
    'allActiveCellsClicked-->',
    allActiveCellsClicked,
    'gridConfig--->',
    gridConfig
  );

  const onActiveCellClick = (rowIndex, columnIndex) => {
    setGridConfig((prev) =>
      prev.map((rowCells, ri) =>
        rowCells.map((cell, ci) => {
          if (ri === rowIndex && ci === columnIndex) {
            return 2;
          } else {
            return cell;
          }
        })
      )
    );
    setOrderOfClicking((prev) => [...prev, [rowIndex, columnIndex]]);
  };

  return (
    <div className={pointerEventsEnabled ? '' : 'disable-pointer-events'}>
      {gridConfig.map((rowCells, rowIndex) => (
        <div className='rowCells' key={rowIndex}>
          {rowCells.map((cell, columnIndex) => (
            <div
              key={columnIndex}
              className={
                cell === 1
                  ? 'active-cell'
                  : cell === 2
                  ? 'active-cell-clicked'
                  : 'non-active-cell'
              }
              onClick={
                cell === 1
                  ? () => onActiveCellClick(rowIndex, columnIndex)
                  : null
              }
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
