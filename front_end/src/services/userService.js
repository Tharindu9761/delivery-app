import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppConst from "../const/const";
const { jwtDecode } = require("jwt-decode");

export async function web_login(email, password) {
  try {
    const response = await fetch(AppConst.LOGIN_WEB, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const res = await response.json();
    if (response.ok && res) {
      if (res.token) {
        return {
          success: true,
          token: res.token,
          key: res.key,
        };
      } else {
        return {
          success: false,
          message: res.message || "Login failed",
        };
      }
    } else {
      return {
        success: false,
        message: res.error || "Invalid email or password",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

export async function get_email() {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (userToken) {
      const user = jwtDecode(userToken);
      return user.email;
    }
    return null;
  } catch (error) {
    console.error("Error fetching email:", error);
    return null;
  }
}

export async function get_name() {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (userToken) {
      const user = jwtDecode(userToken);
      return user.first_name;
    }
    return null;
  } catch (error) {
    console.error("Error fetching email:", error);
    return null;
  }
}

export async function get_user_id() {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (userToken) {
      const user = jwtDecode(userToken);
      return user._id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

export async function get_user_role() {
  try {
    const userToken = await AsyncStorage.getItem("Token");

    if (userToken) {
      const user = jwtDecode(userToken);
      return user.user_type;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function get_user_details() {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (userToken) {
      const response = await fetch(AppConst.FIND_USER, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (response.ok && res.success) {
        return res.data;
      } else {
        console.error("Failed to fetch user details:", res.message);
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

export async function get_pic(type) {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (userToken) {
      const user = jwtDecode(userToken);

      const url =
        type === "thumb"
          ? AppConst.PIC_THUMB(user.id)
          : AppConst.PIC_FULL(user.id);

      return url;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

export async function resetPassword(newPassword) {
  try {
    const userToken = await AsyncStorage.getItem("Token");
    if (!userToken) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const user = jwtDecode(userToken);
    const userId = user.id;

    const response = await fetch(AppConst.RESET_PASSWORD_BY_ID(userId), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newPassword,
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
        message: res.error || "Password reset failed",
      };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: "An error occurred during password reset",
    };
  }
}

export async function resetPasswordByEmail(email, newPassword) {
  try {
    const response = await fetch(AppConst.RESET_PASSWORD_BY_EMAIL(email), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newPassword,
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
        message: res.error || "Password reset failed",
      };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: "An error occurred during password reset",
    };
  }
}

export async function sendResetLink(email) {
  try {
    const response = await fetch(AppConst.SEND_RESET_LINK, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        type: "App",
      }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return {
        success: true,
        message: res.message || "Password reset link sent successfully",
      };
    } else {
      return {
        success: false,
        message: res.message || "Failed to send reset link",
      };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during the password reset process.",
    };
  }
}

export async function createUser(data) {
  try {
    const response = await fetch(AppConst.CREATE_USER, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.newPassword,
        user_type: data.user_type,
        contact_no: data.contact_no,
        no: data.no ? data.no : null,
        street_name: data.street_name ? data.street_name : null,
        suburb: data.suburb ? data.suburb : null,
        postal_code: data.postal_code ? data.postal_code : null,
        state: data.state ? data.state : null,
        status: data.status,
      }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return {
        success: true,
        message: res.message || "Account created successfully",
      };
    } else {
      return {
        success: false,
        message: res.message || "Failed to create account",
      };
    }
  } catch (error) {
    console.error("Account creation error:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during the account creation process.",
    };
  }
}

export async function getUsers({ page, limit, status, user_type }) {
  try {
    const url = AppConst.GET_ALL_USERS(page, limit, status, user_type);

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
      console.error("Failed to fetch users:", res.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function getUserCountForTiles() {
  try {
    const url = AppConst.GET_USER_COUNT_FOR_TILES();

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
      console.error("Failed to fetch count:", res.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching count:", error);
    return null;
  }
}

export async function getUserCountForChart({month}) {
  try {
    const url = AppConst.GET_USER_COUNT_FOR_CHART(month);

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
      console.error("Failed to fetch count:", res.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching count:", error);
    return null;
  }
}
