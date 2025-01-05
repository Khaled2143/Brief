const axios = require("axios");
const { retrieveComments } = require("../utils/retrieveComments");


// Mock Axios so we dont actually call the backend, makes tests faster and isolated
jest.mock("axios");

it("should return an array of comments when the API call is successful", async () => {
  const mockComments = [
    { _id: "1", content: "First Comment", username: "User1", likes: 5 },
    { _id: "2", content: "Second Comment", username: "User2", likes: 17 },
  ];

  // Simulate a successful API response
  axios.get.mockResolvedValue({
    data: { success: true, data: mockComments },
  });
  const comments = await retrieveComments("123"); // A mock Discussion ID
  expect(comments).toEqual(mockComments);
});

it("should return an empty array when no comments are found", async () => {
  axios.get.mockResolvedValue({
    data: { success: true, data: [] },
  });

  const comments = await retrieveComments("123");
  expect(comments).toEqual([]);
});

it("should throw an error when an API call fails", async () => {
  axios.get.mockRejectedValue(new Error("Network Error"));

  await expect(retrieveComments("123")).rejects.toThrow("Network Error");
});
