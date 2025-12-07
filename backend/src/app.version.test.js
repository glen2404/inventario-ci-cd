const request = require("supertest");
const app = require("./app");

test("GET /api/version responde con la versión correcta", async () => {
  const res = await request(app).get("/api/version");

  expect(res.status).toBe(200);
  expect(res.body.version).toBeDefined();
  expect(res.body.author).toBe("glen2404");
});
