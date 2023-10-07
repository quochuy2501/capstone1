import Cookie from "js-cookie";

export const getCookie = (name) => Cookie.get(name);
export const setCookie = (name, value) => Cookie.set(name, value);
export const forgetCookie = (name) => Cookie.remove(name);
