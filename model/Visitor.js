const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "sesac",
  password: "1234",
  database: "sesac",
});

// 1. 전체목록 조회
exports.getVisitors = (cb) => {
  // [DB 연결 전]
  // return [
  //   { id: 1, name: "홍길동", comment: "내가 왔다." },
  //   { id: 2, name: "이찬혁", comment: "으라차차" },
  // ];

  // [DB 연결 후]
  conn.query(`SELECT * FROM visitor`, (err, rows) => {
    if (err) {
      throw err;
    }

    console.log("visitor 테이블 전체 조회", rows);

    // select문의 결과 rows!
    // 배열형태로 들어옴
    //   RowDataPacket { id: 8, name: '홍길동', comment: '내가 왔다' },
    //   RowDataPacket { id: 9, name: '이찬혁', comment: '으라차차' }
    // ]

    cb(rows);
  });
};

// 2. 특정 데이터 조회
// id는 조건, 어떤 정보를 가져올건지 조건
exports.getVisitor = (id, cb) => {
  conn.query(`SELECT * FROM visitor WHERE id=${id}`, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("visitor model 데이터 하나 조회", rows);
    cb(rows[0]);
  });
};

//3.데이터 등록
// visitor 테이블에 데이터 삽입 (INSERT INTO 인설트 인투문)
exports.postVisitor = (data, cb) => {
  // data=req.body,comment와 name 정보가 있는 객체 형태
  conn.query(
    //문자열은 따옴표 안에 둘러싸야함
    `INSERT INTO visitor VALUE(null, "${data.name}", "${data.comment}")`,
    (err, rows) => {
      if (err) throw err;
      console.log("model post", rows);
      /*model post OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 10,
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0
} */

      cb(rows.insertId);
    }
  );
};

//4.데이터 삭제
exports.deleteVisitor = (id, cb) => {
  conn.query(`DELETE FROM visitor WHERE id=${id}`, (err, rows) => {
    if (err) throw err;
    console.log("모델 Visitor.js 특정 데이터 삭제", rows);
    /*
    모델 Visitor.js 특정 데이터 삭제 OkPacket {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
} */
    cb();
  });
};

// 데이터 "수정"
exports.patchVisitor = (data, cb) => {
  console.log("model data", data);
  conn.query(
    `UPDATE visitor SET name="${data.name}", comment="${data.comment}" WHERE id=${data.id} `,
    (err, rows) => {
      if (err) throw err;
      console.log("Visitor.js 수정", rows);
      /*
      Visitor.js 수정 OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      serverStatus: 2,
      warningCount: 0,
      message: '(Rows matched: 1  Changed: 0  Warnings: 0',
      protocol41: true,
      changedRows: 0
} */
      cb();
    }
  );
};
