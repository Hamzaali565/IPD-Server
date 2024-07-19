import moment from "moment-timezone";

export const createdOn = moment(new Date())
  .tz("Asia/Karachi")
  .format("DD/MM/YYYY HH:mm:ss");
