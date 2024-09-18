// test/comment.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const sinon = require("sinon");
const app = require("../server");
const dbClient = require("../utils/db");

chai.use(chaiHttp);

describe("Comment Controller", () => {
  let dbStub;

  before(() => {
    dbStub = sinon.stub(dbClient.db.collection("comments"));
  });

  after(() => {
    dbStub.restore();
  });

  describe("POST /comments", () => {
    it("should add a new comment", async () => {
      const newComment = {
        postId: "123",
        content: "This is a test comment",
      };

      dbStub.insertOne.resolves({ insertedId: "456" });

      const res = await chai
        .request(app)
        .post("/comments")
        .set("Authorization", "Bearer fake_token")
        .send(newComment);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("content", newComment.content);
    });
  });

  describe("GET /posts/:postId/comments", () => {
    it("should return comments for a post", async () => {
      const mockComments = [
        { _id: "1", content: "Comment 1" },
        { _id: "2", content: "Comment 2" },
      ];

      dbStub.find.returns({
        sort: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        toArray: sinon.stub().resolves(mockComments),
      });
      dbStub.countDocuments.resolves(2);

      const res = await chai.request(app).get("/posts/123/comments");

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("comments").with.lengthOf(2);
      expect(res.body).to.have.property("currentPage", 1);
      expect(res.body).to.have.property("totalPages", 1);
      expect(res.body).to.have.property("totalComments", 2);
    });
  });
});
