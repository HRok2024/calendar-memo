import React, { useState, useEffect } from "react";
import CalendarMemo from "./CalendarMemo";
import "../style/Calendar.css";
import ghktkfvy from "../assets/ghktkfvy.png";

// 특정 월의 마지막 날짜 구하는 함수
function getLastDateOfMonth(year, month) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

// 특정 월의 첫 날의 요일 계산 함수
function getFirstDayOfWeek(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  return firstDayOfMonth.getDay(); // 첫 번째 날의 요일을 반환 (0 = 일요일, 6 = 토요일)
}

// 달력 컴포넌트 시작
function Calendar() {
  //유즈스테이트 모음
  const [currentDate, setCurrentDate] = useState(new Date()); //현재날짜 상태 관리
  const [holidays, setHolidays] = useState([]); // 공휴일 상태 관리
  const [clickedDate, setClickedDate] = useState(null); // 클릭된 날짜
  const [memoList, setMemoList] = useState(() => {
    const storedMemoList = localStorage.getItem("memoList");
    return storedMemoList ? JSON.parse(storedMemoList) : [];
  });
  const [memoMap, setMemoMap] = useState({});

  //일반변수 모음
  const currentYear = currentDate.getFullYear(); //현재 년도
  const currentMonth = currentDate.getMonth(); //현재 달

  // 해당 월의 마지막 날짜 계산
  const lastDayOfMonth = getLastDateOfMonth(currentYear, currentMonth);

  // 해당 월의 첫 날의 요일 계산
  const startingDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  // 공휴일 날짜를 키값으로 설정 (예: '2025-01-01' -> '신정')
  const holidayMap = holidays.reduce((acc, holiday) => {
    const holidayDate = new Date(holiday.date);
    const dateKey = `${holidayDate.getFullYear()}-${
      holidayDate.getMonth() + 1
    }-${holidayDate.getDate()}`;
    acc[dateKey] = holiday.localName; // 공휴일 날짜와 이름을 매핑
    return acc;
  }, {});

  // 달력의 날짜 배열 만들기
  const daysInMonth = [];
  let day = 1;

  // 이전/다음 달로 이동하는 함수
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // 공휴일 API 호출
  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/KR`)
      .then((res) => res.json())
      .then((data) => {
        setHolidays(data); // 공휴일 데이터를 상태에 저장
      })
      .catch((err) => console.log(err));
  }, [currentYear]);

  // 날짜의 스타일을 설정하는 함수
  const getDayStyle = (dayInfo, dayOfWeek) => {
    //날짜가 없으면 스타일 없음
    if (!dayInfo) return {};
    let style = {};

    //공휴일을 우선적으로 빨간색 처리, 일요일은 빨간색, 토요일은 파란색
    if (dayInfo.holiday) {
      style.color = "red";
    } else if (dayOfWeek == 0) {
      style.color = "red";
    } else if (dayOfWeek == 6) {
      style.color = "blue";
    }
    return style;
  };

  //클릭한 날짜를 받아서 저장하기
  const handleDateClick = (dayInfo) => {
    const day = dayInfo.day;
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = (currentMonth + 1).toString().padStart(2, "0");

    // 클릭된 날짜가 이미 활성화된 날짜라면 닫기, 아니면 열기
    const selectedDate = `${currentYear}-${formattedMonth}-${formattedDay}`;
    setClickedDate(clickedDate === selectedDate ? null : selectedDate);
  };

  //클릭된 날짜 데이터 제거하기(메모 컴포넌트 닫기)
  const closeMemo = () => {
    setClickedDate(null);
  };

  //로컬저장소에 메모 저장 및 메모리스트 맵 생성
  useEffect(() => {
    localStorage.setItem("memoList", JSON.stringify(memoList));
    //메모 날짜를 키값으로 메모맵 생성
    const newMemoMap = memoList.reduce((acc, memo) => {
      const { date, text } = memo; // 메모의 날짜와 내용을 추출
      if (!acc[date]) {
        acc[date] = []; // 날짜가 없으면 배열 초기화
      }
      acc[date].push(text); // 해당 날짜에 메모 추가
      return acc;
    }, {});
    setMemoMap(newMemoMap);
  }, [memoList]);

  // 첫날부터 시작해서 마지막 날짜까지 달력에 날짜를 채운다
  for (let i = 0; i < 6; i++) {
    // 최대 6주
    const week = [];
    for (let j = 0; j < 7; j++) {
      // 일주일
      if (i === 0 && j < startingDayOfWeek) {
        week.push(null); // 첫 주는 공백
      } else if (day <= lastDayOfMonth) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`; // 'YYYY-MM-DD' 형태로 비교
        //메모용 키 변수
        const memoKey = `${currentYear}-${(currentMonth + 1)
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        week.push({
          day,
          holiday: holidayMap[dateKey] || null, // 공휴일이면 이벤트명 출력, 아니면 null
          memo: memoMap[memoKey] || [],
        });
        day++;
      } else {
        week.push(null); // 마지막 주는 공백
      }
    }
    daysInMonth.push(week);
    if (day > lastDayOfMonth) break; // 마지막 날짜까지 채우면 종료
  }

  //console.log("메모맵" + JSON.stringify(memoMap));
  return (
    <div className="cal-section">
      <div className="cal-wrap">
        <div className="calcon-wrap">
          <div className="cal-control">
            <span className="cal-btn" onClick={() => changeMonth(-1)}>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  transform: "rotate(180deg)",
                }}
                src={ghktkfvy}
                alt=""
              />
            </span>
            <h2 className="cal-title">
              {currentYear}년 {currentMonth + 1}월
            </h2>
            <span className="cal-btn" onClick={() => changeMonth(1)}>
              <img
                style={{ width: "50px", height: "50px" }}
                src={ghktkfvy}
                alt=""
              />
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {daysInMonth.map((week, idx) => (
                <tr key={idx}>
                  {week.map((dayInfo, idx) => {
                    const dayStyle = dayInfo ? getDayStyle(dayInfo, idx) : {};
                    const dayPointer = dayInfo ? { cursor: "pointer" } : {};
                    return (
                      <td
                        key={idx}
                        style={{ ...dayStyle, ...dayPointer }}
                        onClick={() => handleDateClick(dayInfo)}
                      >
                        {dayInfo ? (
                          <>
                            <div
                              style={{
                                backgroundColor:
                                  dayInfo.memo.length > 0 ? "#d1c5ff" : "",
                                borderRadius:
                                  dayInfo.memo.length > 0 ? "50%" : "",
                                width: dayInfo.memo.length > 0 ? "30px" : "",
                                height: dayInfo.memo.length > 0 ? "30px" : "",
                                boxShadow:
                                  dayInfo.memo.length > 0
                                    ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                                    : "",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "auto",
                              }}
                            >
                              <div>{dayInfo.day}</div>
                            </div>
                            {dayInfo.holiday && (
                              <div style={{ color: "red", fontSize: "12px" }}>
                                {dayInfo.holiday}
                              </div>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`memo-con ${clickedDate ? "active" : ""}`}>
        {clickedDate && (
          <CalendarMemo
            clickedDate={clickedDate}
            closeMemo={closeMemo}
            currentYear={currentYear}
            currentMonth={currentMonth + 1}
            memoList={memoList}
            setMemoList={setMemoList}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
