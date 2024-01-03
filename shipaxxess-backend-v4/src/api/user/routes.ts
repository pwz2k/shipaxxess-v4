import { Hono } from "hono";
import { AddressesUser } from "./addresses";
import { DashboardUser } from "./dashboard";
import { LabelsUser } from "./labels";
import { PackagesUser } from "./packages";
import { PaymentUser } from "./payment";
import { ReferralsUser } from "./referrals";
import { SettingsUser } from "./settings";
import { StatusUser } from "./status";
import { StoresUser } from "./stores";
import { TicketsUser } from "./tickets";
import { TypeUser } from "./types";
import { WeightsUser } from "./weights";

const user = new Hono<App>();

// Status routes
user.get("/status", StatusUser);

// Dashboard routes
user.get("/dashboard", DashboardUser);

// Labels routes
user.get("/labels/batch", LabelsUser.GetAll);
user.post("/labels/batch", LabelsUser.Create);
user.post("/labels/refund", LabelsUser.Refund);
user.get("/labels/batch/:uuid", LabelsUser.Get);

// Addresses routes
user.get("/addresses", AddressesUser.GetAll);
user.post("/addresses", AddressesUser.Create);
user.patch("/addresses", AddressesUser.Edit);
user.delete("/addresses", AddressesUser.Delete);
user.get("/addresses/:uuid", AddressesUser.Get);

// Packages routes
user.get("/packages", PackagesUser.GetAll);
user.post("/packages", PackagesUser.Create);
user.patch("/packages", PackagesUser.Edit);
user.delete("/packages", PackagesUser.Delete);
user.get("/packages/:uuid", PackagesUser.Get);

// Payments routes
user.get("/payments", PaymentUser.Get);
user.post("/payments", PaymentUser.Create);

// Tickets routes
user.get("/tickets", TicketsUser.Get);
user.post("/tickets", TicketsUser.Create);
user.get("/tickets/:ticket_id", TicketsUser.Find);
user.post("/tickets/:ticket_id", TicketsUser.PostMessage);

// Referral routes
user.get("/referrals", ReferralsUser.Get);

// Stores routes
user.get("/stores", StoresUser);

// Settings routes
user.post("/settings", SettingsUser.Edit);

// Weights routes
user.get("/weights", WeightsUser.GetAll);
user.post("/weights", WeightsUser.Post);

// Types routes
user.get("/types", TypeUser.GetAll);

export { user };
