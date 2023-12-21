import { Hono } from "hono";
import { AddressesUser } from "./addresses";
import { DashboardUser } from "./dashboard";
import { LabelsUser } from "./labels";
import { PackagesUser } from "./packages";
import { PaymentUser } from "./payment";
import { ReferralsUser } from "./referrals";
import { RefundUser } from "./refund";
import { SettingsUser } from "./settings";
import { StatusUser } from "./status";
import { StoresUser } from "./stores";
import { TicketsUser } from "./tickets";
import { UpsBatchLabelUser } from "./ups";
import { USPSBatchLabelUser } from "./usps";
import { WeightsUser } from "./weights";

const user = new Hono<App>();

// Status routes
user.get("/status", StatusUser);

// Dashboard routes
user.get("/dashboard", DashboardUser);

// Labels routes
user.get("/labels/batchs", LabelsUser.GetAll);
user.post("/labels/usps/batch", USPSBatchLabelUser);
user.post("/labels/usps/refund", RefundUser);
user.post("/labels/ups/batch", UpsBatchLabelUser);

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
user.post("/weights", WeightsUser.Get);

export { user };
