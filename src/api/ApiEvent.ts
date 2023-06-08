import Api from "./ApiGlobal";

export type EventInformation = {
  id: number;
  accId: number;
  dateFrom: string;
  timeFrom: string;
  dateTo: string;
  timeTo: string;
  type: number;
  doctorId: number;
  vacId: number;
  description: string;
  isActive: boolean;
  insertedDate: Date;
  insertedAccId: number;
  modifiedDate: Date;
  modifiedAccId: number;
};

export const takeEventTerm = (data: EventInformation) => {
  return Api.patch("/event/takeeventterm", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const finishEventTerm = (data: EventInformation) => {
  return Api.patch("/event/finishterm", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const getNurseEvents = (accountId: Number) => {
  return Api.get("/event/getnurseevents", {
    params: { accountId },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const getSelectedEvent = (eventId: Number) => {
  return Api.get("/event?eventId="+String(eventId), {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
