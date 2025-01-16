import React, { useEffect, useState } from "react";
import MemoList from "./MemoList";
import ProgressMemo from "./ProgressMemo";
import "../style/CalendarMemo.css";
import rhqvy from "../assets/rhqvy.png";

function CalendarMemo({
  clickedDate,
  closeMemo,
  currentYear,
  currentMonth,
  memoList,
  setMemoList,
}) {
  //유즈스테이트 모음
  const [memo, setMemo] = useState("");
  const [filterMemo, setFilterMemo] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  const [dayList, setDayList] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [monthFilter, setMonthFilter] = useState([]);
  const [dayFilter, setDayFilter] = useState([]);
  const [pYear, setPYear] = useState("");
  const [pMonth, setPMonth] = useState("");
  const [pDay, setPDay] = useState("");

  useEffect(() => {
    setPYear(
      yearList.length !== 0
        ? Math.round((yearFilter.length / yearList.length) * 100)
        : 0
    );
    setPMonth(
      monthList.length !== 0
        ? Math.round((monthFilter.length / monthList.length) * 100)
        : 0
    );
    setPDay(
      dayList.length !== 0
        ? Math.round((dayFilter.length / dayList.length) * 100)
        : 0
    );
  }, [dayFilter]);

  useEffect(() => {
    setYearFilter(yearList.filter((item) => item.done === true));
  }, [yearList]);
  useEffect(() => {
    setMonthFilter(monthList.filter((item) => item.done === true));
  }, [monthList]);
  useEffect(() => {
    setDayFilter(dayList.filter((item) => item.done === true));
  }, [dayList]);

  //클릭된 날짜로 필터링해서 메모 리스트를 저장하는 유즈이펙트
  useEffect(() => {
    setFilterMemo(memoList.filter((item) => item.date === clickedDate));
  }, [clickedDate, memoList]);

  //메모를 연, 월, 일 단위로 필터링
  useEffect(() => {
    setYearList(
      memoList.filter(
        (item) => item.date.split("-")[0] === currentYear.toString()
      )
    );
    setMonthList(
      memoList.filter(
        (item) =>
          item.date.split("-")[1] === currentMonth.toString().padStart(2, "0")
      )
    );
    setDayList(memoList.filter((item) => item.date === clickedDate));
  }, [memoList, clickedDate]);

  //메모리스트에서 메모를 삭제하는 함수
  const deleteMemo = (iden) => {
    setMemoList(memoList.filter((item) => item.id != iden));
  };

  //모든 메모 리스트 저장 함수
  const saveMemoList = () => {
    setMemoList([
      ...memoList,
      { id: Date.now(), text: memo, date: clickedDate, done: false },
    ]);
    setMemo("");
  };

  //메모 수정 함수
  const saveEdit = (iden, newText) => {
    setMemoList((prev) =>
      prev.map((item) => (item.id == iden ? { ...item, text: newText } : item))
    );
  };

  //메모 완료 함수
  const completeMemo = (iden) => {
    setMemoList((prev) =>
      prev.map((item) =>
        item.id == iden ? { ...item, done: !item.done } : item
      )
    );
  };
  return (
    <div className="memo-section">
      <div className="xbox">
        <span onClick={closeMemo}>
          <img
            style={{ width: "60px", height: "60px", cursor: "pointer" }}
            src={rhqvy}
            alt="메모닫기"
          />
        </span>
      </div>
      <div className="list-wrap">
        <div className="list-container">
          <div className="list-top">
            <div style={{ width: "50%" }}>
              <ProgressMemo
                clickedDate={clickedDate}
                pYear={pYear}
                pMonth={pMonth}
                pDay={pDay}
              />
            </div>
            <div style={{ width: "50%" }}>
              <div className="textarea-wrap">
                <div>
                  <h3>
                    {clickedDate.split("-")[0]}년{clickedDate.split("-")[1]}월
                    {clickedDate.split("-")[2]}일 - 일정 등록하기
                  </h3>
                  <textarea
                    value={memo}
                    onChange={(e) => {
                      setMemo(e.target.value);
                    }}
                  />
                </div>
                <button onClick={saveMemoList}>일정 등록</button>
              </div>
            </div>
          </div>
          <div className="list-bottom">
            <h3>메모 리스트</h3>
            {filterMemo.map((item, idx) => (
              <MemoList
                key={item.id}
                item={item}
                idx={idx + 1}
                clickedDate={clickedDate}
                deleteMemo={deleteMemo}
                saveEdit={saveEdit}
                completeMemo={completeMemo}
                com={item.done}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarMemo;
