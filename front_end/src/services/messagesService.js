import * as AppConst from "../const/const";

export async function getMessages({ page, limit, type }) {
  try {
    const url = AppConst.GET_MESSAGES(page, limit, type);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (response.ok) {
      return res;
    } else {
      console.error("Failed to fetch messages:", res.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
}

export async function read(id) {
  try {
    const response = await fetch(AppConst.READ(id), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "Read",
      }),
    });

    const res = await response.json();

    if (response.ok && res.message) {
      return {
        success: true,
        message: res.message,
      };
    } else {
      return {
        success: false,
        message: res.error || "Message read failed",
      };
    }
  } catch (error) {
    console.error("Message read error:", error);
    return {
      success: false,
      message: "An error occurred during Message read",
    };
  }
}
