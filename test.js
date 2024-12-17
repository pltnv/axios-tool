import { api } from "./index.js";

const apiManager = api({
  url: "https://jsonplaceholder.typicode.com/",
  interceptors: { request: { onFulfilled: requestOnFulfilled } },
});

function requestOnFulfilled(config) {
  console.log("done", config);
}

async function getPost1() {
  try {
    const kek = await apiManager.get("/posts/1", {});
    return kek;
  } catch (e) {
    console.log(e);
  }
}

async function getCommentWithQuery() {
  try {
    const kek = await apiManager.$get("/comments", {
      params: {
        postId: 1,
      },
    });
    return kek;
  } catch (e) {
    console.log(e);
  }
}

setTimeout(async () => {
  let res = await getCommentWithQuery();
  console.log(res);
}, 5000);
