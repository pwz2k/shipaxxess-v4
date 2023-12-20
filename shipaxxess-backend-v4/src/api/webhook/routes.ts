import { Hono } from "hono";

const webhook = new Hono<App>();

export { webhook };
