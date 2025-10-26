import { api } from "./index.js";
import { InternalAxiosRequestConfig } from "axios";

function requestOnFulfilled(config: InternalAxiosRequestConfig) {
  return config;
}

const apiManager = api({
  url: "https://jsonplaceholder.typicode.com/",
  interceptors: { request: { onFulfilled: requestOnFulfilled } },
});

async function getPost1() {
  try {
    const result = await apiManager.get("/posts/1", {});
    return result;
  } catch (e) {
    console.log(e);
  }
}

async function getCommentWithQuery() {
  try {
    const result = await apiManager.$get("/comments", {
      postId: 1,
    });
    return result;
  } catch (e) {
    console.log(e);
  }
}

setTimeout(async () => {
  let res = await getCommentWithQuery();
  console.log(res);
}, 5000);
