import React, { useState } from "react";
import "../style/MemoList.css";
import check from "../assets/check.png";
import notcheck from "../assets/notcheck.png";
import editmenu from "../assets/editmenu.png";
import deletemenu from "../assets/delete.png";
import rhqvy from "../assets/rhqvy.png";
import editsubmit from "../assets/editsubmit.png";

function MemoList({
  item,
  idx,
  clickedDate,
  deleteMemo,
  saveEdit,
  completeMemo,
  com,
}) {
  //유즈스테이트 모음
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(item.text);
  const [isComplete, setIsComplete] = useState(com);

  //수정창 토글 함수
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  //수정내용 초기화 함수
  const originText = () => {
    setNewText(item.text);
  };

  // 완료 버튼 클릭 시 메모에 가로줄 추가/제거
  const handleComplete = () => {
    setIsComplete((prev) => !prev);
  };

  return (
    <div className="detail-wrap">
      <div className="checkBtn">
        <img
          src={isComplete ? check : notcheck}
          alt="complete"
          width="30px"
          height="30px"
          onClick={() => {
            completeMemo(item.id);
            handleComplete();
          }}
        />
      </div>
      <div
        className="memoContent"
        style={{
          textDecoration: isComplete ? "line-through" : "none",
          color: isComplete ? "gray" : "black",
          width: "100%",
          height: "13vh",
          borderRadius: "15px",
          padding: "15px",
          border: "1px solid #f2f2f2",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>#{idx}</div>
        <div>{item.text}</div>
      </div>
      <div className="edit-wrap">
        {isEditing ? (
          <div className="editmenu">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              type="text"
            />
            <div>
              <img
                width="30px"
                height="30px"
                src={editsubmit}
                onClick={() => {
                  saveEdit(item.id, newText);
                  toggleEdit();
                }}
              />
              <img
                width="30px"
                height="30px"
                src={rhqvy}
                onClick={() => {
                  originText();
                  toggleEdit();
                }}
              />
            </div>
          </div>
        ) : (
          <img width="30px" height="30px" src={editmenu} onClick={toggleEdit} /> // 수정 버튼
        )}
        <img
          width="30px"
          height="30px"
          src={deletemenu}
          onClick={() => deleteMemo(item.id)}
        />
      </div>
    </div>
  );
}

export default MemoList;
