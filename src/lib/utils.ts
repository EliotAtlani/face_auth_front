import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWebSocketUrl = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const protocol = isDevelopment ? "ws://" : "wss://";
  const host = isDevelopment ? "localhost:8000" : "api.eliotatlani.fr";
  const endpoint = "/ws";
  return `${protocol}${host}${endpoint}`;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
