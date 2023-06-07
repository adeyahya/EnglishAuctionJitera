import "reflect-metadata";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Container from "typedi";
import PrismaUserRepository from "@/repositories/PrismaUserRepository";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
