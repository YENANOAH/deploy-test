const tbody = document.querySelector("tbody");
//방명록 "등록"
function createVisitor() {
  const form = document.forms["visitor-form"];

  if (form.name.value.length === 0 || form.comment.value.length === 0) {
    alert("이름과 방명록을 모두 작성해주세요");
    return;
  }
  //테이블 생성시 name 컬럼을 varchar(10)으로 설정해두어서
  // 프론트에서 유효성 검사를 하고 데이터 전송
  if (form.name.value.length > 10) {
    alert("이름은 10글자 미만으로 작성하세요");
    return;
  }

  axios({
    method: "post",
    url: "/visitor",
    data: {
      name: form.name.value,
      comment: form.comment.value,
    },
  })
    .then((res) => {
      console.log(res.data);
      const { id, comment, name } = res.data;
      console.log(id);
      const newHtml = ` 
      <tr id="tr_${id}">
          <td>${id}</td>
          <td>${name}</td>
          <td>${comment}</td>
          <td>
            <button onclick="editVisitor(${id})">수정</button>
          </td>
          <td>
            <button onclick="deleteVisitor(this,${id})">
              삭제
            </button>
          </td>
        </tr>`;
      //tbody.append(newHtml); // 문자열이 그대로 붙음
      tbody.insertAdjacentHTML("beforeend", newHtml);
      // 문자열을 특정 요소의 맨 마지막으로 HTML 추가
      form.reset();
    })
    .catch((err) => console.error(err));
}

//방명록 "삭제"
//DELETE /visitor
function deleteVisitor(btn, id) {
  console.log(id);
  console.log(btn); // 태그
  axios({
    method: "delete",
    url: "/visitor",
    data: {
      id: id,
    },
  })
    .then((text) => {
      console.log(text.data);
      //   btn.parentElement.parentElement.remove(); //삭제버튼
      btn.closest(`#tr_${id}`).remove(); //삭제버튼
    })
    .catch((err) => console.error(err));
}

//방명록 "수정"
//수정버튼을 누르면
// GET /visitor/:id 하나의 데이터 조회
// 1. 수정을 위한 입력창으로 변함
function editVisitor(id) {
  const form = document.forms["visitor-form"];
  axios({
    method: "get",
    url: `/visitor/${id}`,
  })
    .then((res) => {
      console.log(res.data);
      const { name, comment, id } = res.data;
      console.log(id);
      form.name.value = name;
      form.comment.value = comment;

      const btnContainer = document.getElementById("btn-group");
      const html = `
      <button type="button" onclick=editDo(${id})>수정하기</button>
      <button type="button" onclick="editCancel()">수정취소</button>
      `;
      btnContainer.innerHTML = html;
    })
    .catch((err) => console.error(err));
}

// 2. 실제 수정 데이터를 요청
// PATCH /visitor
function editDo(id) {
  const form = document.forms["visitor-form"];
  if (form.name.value.length === 0 || form.comment.value.length === 0) {
    alert("이름과 방명록을 모두 작성해주세요");
    return;
  }
  //테이블 생성시 name 컬럼을 varchar(10)으로 설정해두어서
  // 프론트에서 유효성 검사를 하고 데이터 전송
  if (form.name.value.length > 10) {
    alert("이름은 10글자 미만으로 작성하세요");
    return;
  }

  axios({
    method: "patch",
    url: "/visitor",
    data: {
      id: id,
      comment: form.comment.value,
      name: form.name.value,
    },
  })
    .then((res) => {
      console.log(res.data); //"수정완료"
      //   const { id, name, comment } = res.data;
      const tr = document.querySelector(`#tr_${id}`);
      console.log(tr.children);
      const children = tr.children; // children = [td,td,td,td,td]
      console.log(children);
      children[1].textContent = form.name.value; //작성자
      children[2].textContent = form.comment.value; //방명록 내용
    })
    .catch((err) => console.error(err));
}

//수정 취소
function editCancel() {
  // (1) form 안의 input 초기화
  const form = document.forms["visitor-form"];
  // form.reset();
  form.name.value = "";
  form.comment.value = "";
  // (2) 등록버튼 보이도록
  const btnContainer = document.getElementById("btn-group");
  btnContainer.innerHTML = `
    <button type="button" onclick="createVisitor()">방명록 등록</button>`;
}
