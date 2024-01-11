import { Hono } from "hono";
import { CronsAdmin } from "./crons";
import { LabelsAdmin } from "./labels";
import { PaymentsAdmin } from "./payments";
import { AdminSettings } from "./settings";
import { StatusAdmin } from "./status";
import { TicketsAdmin } from "./tickets";
import { TypesAdmin } from "./types";
import { UsersAdmin } from "./users";
import { WeightsAdmin } from "./weights";

const admin = new Hono<App>();

// Status routes
admin.get("/status", StatusAdmin);

// Batches routes
admin.get("/labels/batch", LabelsAdmin.GetAll);
admin.get("/labels/batch/:uuid", LabelsAdmin.Get);

// Payments routes
admin.get("/payments", PaymentsAdmin.GetAll);
admin.post("/payments", PaymentsAdmin.Accept);
admin.delete("/payments", PaymentsAdmin.Reject);

// Tickets routes
admin.get("/tickets", TicketsAdmin.GetAll);
admin.delete("/tickets", TicketsAdmin.Close);
admin.post("/tickets", TicketsAdmin.PostMessage);
admin.get("/tickets/:uuid", TicketsAdmin.Get);

// Types routes
admin.get("/types", TypesAdmin.GetAll);
admin.post("/types", TypesAdmin.Create);
admin.patch("/types", TypesAdmin.Edit);
admin.delete("/types", TypesAdmin.Delete);
admin.get("/types/:uuid", TypesAdmin.Get);

// Users routes
admin.get("/users", UsersAdmin.GetAll);
admin.post("/users", UsersAdmin.Create);
admin.patch("/users", UsersAdmin.Edit);
admin.delete("/users", UsersAdmin.Delete);
admin.get("/users/:uuid", UsersAdmin.Get);
admin.get("/users/:id", UsersAdmin.MakeAdmin);

// Weights
admin.get("/weights", WeightsAdmin.GetAll);
admin.post("/weights", WeightsAdmin.Create);
admin.patch("/weights", WeightsAdmin.Edit);
admin.delete("/weights", WeightsAdmin.Delete);
admin.get("/weights/:uuid", WeightsAdmin.Get);

// Settings
admin.get("/settings", AdminSettings.GetAll);
admin.get("/settings/init", AdminSettings.Init);
admin.post("/settings/payments", AdminSettings.Payment);
admin.post("/settings/email", AdminSettings.Email);
admin.post("/settings/label", AdminSettings.Label);

// Crons
admin.get("/crons", CronsAdmin.GetAll);
admin.post("/crons", CronsAdmin.Reprocess);
admin.delete("/crons", CronsAdmin.Remove);

export { admin };
