import React from "react";
import "../style/ProgressMemo.css";

function ProgressMemo({ clickedDate, pYear, pMonth, pDay }) {
  const yearProgress = `${pYear}%`;
  const monthProgress = `${pMonth}%`;
  const dayProgress = `${pDay}%`;
  return (
    <div className="progress-wrap">
      <div className="progress-bar-container">
        <h4>연간 달성도</h4>
        <div className="progress-bar" style={{ width: yearProgress }}>
          {pYear}%
        </div>
      </div>
      <div className="progress-bar-container">
        <h4>월간 달성도</h4>
        <div className="progress-bar" style={{ width: monthProgress }}>
          {pMonth}%
        </div>
      </div>
      <div className="progress-bar-container">
        <h4>일간 달성도</h4>
        <div className="progress-bar" style={{ width: dayProgress }}>
          {pDay}%
        </div>
      </div>
    </div>
  );
}

export default ProgressMemo;
