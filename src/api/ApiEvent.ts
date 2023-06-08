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