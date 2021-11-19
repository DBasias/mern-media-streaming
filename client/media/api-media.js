import config from "../../config/config";

const create = async (params, credentials, media) => {
  try {
    let response = await fetch("/api/media/new/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: media,
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, signal) => {
  try {
    let response = await fetch(
      config.serverUrl + "/api/media/" + params.mediaId,
      {
        method: "GET",
        signal: signal,
      }
    );

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listPopular = async signal => {
  try {
    let response = await fetch("/api/media/listPopular", {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, read, listPopular };
