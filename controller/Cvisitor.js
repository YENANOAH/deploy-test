// const Visitor = require("../model/Visitor");
const models = require("../models/index");
const { errorlogs } = require("../utils/common");
// console.log(Visitor.getVisitors());

/* / GET */
exports.main = (req, res) => {
  res.render("index");
};

/* /visitors GET */
exports.getVisitors = (req, res) => {
  // [DB 연결전]
  // res.render("visitors", { data: Visitor.getVisitors() });
  // [DB 연결후, Sequelize 전]
  // Visitor.getVisitors((result) => {
  //   console.log("전체목록 Cvisitor.js", result);
  //   res.render("visitors", { data: result });
  // });
  // [Sequelize 이후]
  // ` SELECT * FROM visitor`
  models.Visitor.findAll()
    .then((result) => {
      console.log("findAll>>", result);
      // findAll의 결과는 배열
      // res.send(result);
      res.render("visitors", { data: result });
    })
    .catch((err) => {
      console.log("getVisitors Controller Err", err);
      res.status(500).send("server err!");
    });
};

/* /visitor/:id GET*/
exports.getVisitor = async (req, res) => {
  console.log(req.params); // {id:'1'}
  console.log(req.params.id); // '2'
  // [Sequelize 이전]
  // Visitor.getVisitor(req.params.id, (result) => {
  //   console.log("한 개의 데이터 Cvisitor.js", result);
  //   res.send(result);
  // });
  // res.send("response");

  // [Sequelize 이후]
  // `SELECT * FROM visitor WHERE id${req.params.id}`
  try {
    const result = await models.Visitor.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log("findOne >>", result);
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Internal Server Error");
  }
};

/* /visitor POST, 등록*/
exports.postVisitor = (req, res) => {
  console.log("req.body", req.body);
  // [sequelize 이전]
  // Visitor.postVisitor(req.body, (result) => {
  //   console.log("Cvisitor.js", result);
  //   res.send({
  //     id: result,
  //     comment: req.body.comment,
  //     name: req.body.name,
  //   });
  // });

  // [sequelize 이후]
  // ``
  models.Visitor.create({
    name: req.body.name,
    Comment: req.body.comment,
  })
    .then((result) => {
      console.log(result);
      res.send("response");
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).send("server err");
    });
};

/* /visitor DELETE, 삭제 */
exports.deleteVisitor = async (req, res) => {
  console.log(req.body); // { id: '3' }
  console.log(req.body.id); // '3'
  //[sequelize 이전]
  // Visitor.deleteVisitor(req.body.id, () => {
  //   res.send(req.body.id + "번 id 삭제완료");
  // });

  //[sequelize 이후]
  try {
    const result = await models.Visitor.destroy({
      where: { id: req.body.id },
    });
    console.log(result);
    // 1 (삭제성공), 0 (삭제실패-없는 데이를 지우려고 할때)
    // 1을 true로, 0은 false로 변경
    if (Boolean(result)) {
      // Numver to Boolean
      res.send(req.body.id + "번 id 삭제완료");
    } else {
      res.send("잘못된 접근입니다!! ");
    }
  } catch (err) {
    console.log("err", err);
    res.send("internal server error!");
  }
};

/* /visitor PATCH, 수정 */
exports.patchVisitor = async (req, res) => {
  console.log(req.body);
  //[sequelize 전]
  // Visitor.patchVisitor(req.body, () => {
  //   res.send("수정 완료");
  // });

  //[sequlize 후]
  try {
    const [result] = await models.Visitor(
      {
        name: req.body.name,
        comment: req.body,
        comment,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    console.log(result); // [1],[0]
    // const [number] = result[0];
    // console.log(number);
    if (Boolean(result)) {
      res.send("수정완료");
    } else {
      res.send("잘못된 접근입니다");
    }
    res.send("수정완료");
  } catch (err) {
    errorlogs(err, "patch controller 내부", "수정에라가 났어요", 500);
  }
};
