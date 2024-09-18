// test/post.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const sinon = require("sinon");
const app = require("../server");
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

chai.use(chaiHttp);

describe("Post Controller", () => {
  let dbStub, redisStub;

  before(() => {
    dbStub = sinon.stub(dbClient.db.collection("posts"));
    redisStub = sinon.stub(redisClient);
  });

  after(() => {
    dbStub.restore();
    redisStub.restore();
  });

  describe("GET /posts", () => {
    it("should return a list of posts", async () => {
      const mockPosts = [
        { _id: "1", title: "Post 1", content: "Content 1" },
        { _id: "2", title: "Post 2", content: "Content 2" },
      ];

      dbStub.find.returns({
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        toArray: sinon.stub().resolves(mockPosts),
      });
      dbStub.countDocuments.resolves(2);

      redisStub.get.resolves(null);
      redisStub.set.resolves("OK");

      const res = await chai.request(app).get("/posts");

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("posts").with.lengthOf(2);
      expect(res.body).to.have.property("currentPage", 1);
      expect(res.body).to.have.property("totalPages", 1);
      expect(res.body).to.have.property("totalPosts", 2);
    });
  });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const newPost = {
        title: "New Post",
        content: "New Content",
        tags: ["tag1", "tag2"],
      };

      dbStub.insertOne.resolves({ insertedId: "123" });
      redisStub.del.resolves(1);

      const res = await chai
        .request(app)
        .post("/posts")
        .set("Authorization", "Bearer fake_token") // You'll need to implement proper auth for tests
        .send(newPost);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("title", newPost.title);
      expect(res.body).to.have.property("content", newPost.content);
      expect(res.body).to.have.property("tags").that.deep.equals(newPost.tags);
    });
  });

  describe("GET /posts/search", () => {
    it("should return search results", async () => {
      const mockResults = [
        { _id: "1", title: "Matching Post 1", content: "Content 1" },
        { _id: "2", title: "Matching Post 2", content: "Content 2" },
      ];

      dbStub.find.returns({
        sort: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        toArray: sinon.stub().resolves(mockResults),
      });
      dbStub.countDocuments.resolves(2);

      const res = await chai.request(app).get("/posts/search?query=matching");

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("posts").with.lengthOf(2);
      expect(res.body).to.have.property("currentPage", 1);
      expect(res.body).to.have.property("totalPages", 1);
      expect(res.body).to.have.property("totalPosts", 2);
    });
  });
});
