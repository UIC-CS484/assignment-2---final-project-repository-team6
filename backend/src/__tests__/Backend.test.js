import request from 'supertest'
import '@testing-library/jest-dom'
import app from '../../index.js'

describe("POST /register", () => {
  describe("PASS TEST: When passed a username and password", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/register").send({
        name: "name", 
        username: "username", 
        password: "password" 
      })
      expect(response.statusCode).toBe(200)
    })
    test("should fail because the integer inputs are not acceptable", async () => {
      const response = await request(app).post("/register").send({
        name: 1234, 
        username: 456, 
        password: 5555 
      })
      expect(response.statusCode).not.toBe(200)
    })
  })
})

describe("POST /edit_password", () => {
  describe("FAIL TEST: Non logged in user is trying to update a password", () => {
    test("should respond with a 500 status code", async () => {
      const response = await request(app).post("/edit_password").send({
        current_user: "username",
        updated_password: "new_password"
      })
      expect(response.statusCode).toBe(500)
    })
  })
})

describe("POST /logout", () => {
  describe("PASS TEST: Test should pass with expected value", () =>{
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/logout").send({
      })
      expect(response.statusCode).toBe(200)
    })
  })
})

describe("POST /youtube_api_search", () => {
  describe("FAIL TEST: Test should return 200, expect 401 and expect to fail on purpose", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/youtube_api_search").send({
      search_string: "https://www.youtube.com"
      })
      expect(response.statusCode).not.toBe(401);
      expect(response.statusCode).toBe(200);
    })
  })
})

describe("GET /user", () => {
  describe("Checking cookie is not set because there is no user logged in", () => {
    test('No cookie returned unless user is logged in', async () => {
      const response = await request(app)
      .get('/user')
        .expect('Content-Type', /text/)
        .expect(404)
    }); 
  })
})
