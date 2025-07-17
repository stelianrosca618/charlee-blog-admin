import moment from 'moment';

export interface CalendarEventObj {
  // Define the properties of eventObj here, for example:
  title: string;
  eventStartDate: Date;
  eventEndDate: Date;
  location?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  // Add other properties as needed
}

export const getGoogleCalendarUrl = (info: CalendarEventObj) => {
  let utcMomentObject = moment(new Date(info.eventStartDate)).utc();
  let googleCalendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=" + utcMomentObject.format("YYYYMMDDTHHmmss") + "Z%2F" + utcMomentObject.add(30, 'minutes').format("YYYYMMDDTHHmmss") + "Z&details=" + encodeURIComponent(info.title) + "&text=" + info.title;
  return googleCalendarUrl;
}

export const getOutlookLiveCalendarUrl = (info: CalendarEventObj) => {
  let utcStartObject = moment(new Date(info.eventStartDate)).utc();
  let utcEndObject = moment(new Date(info.eventEndDate)).utc();
  let outlookCalendarUrl = `https://outlook.live.com/owa/?path=/calendar/action/compose&rrv=addevent&startdt=${utcStartObject.format("YYYY-MM-DDTHH")}&enddt=${utcEndObject.format("YYYY-MM-DDTHH")}&location=${info.address},%20${info.city},%20${info.state},%20${info.zip},%20${info.country}&subject=${info.title}&body`;
  // let outlookCalendarUrl = "https://outlook.live.com/calendar/0/action/compose?allday=false&body=" + encodeURIComponent(info.title) + "&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=" + utcMomentObject.format("YYYY-MM-DDTHH") + "%3A" + utcMomentObject.format("mm") + "%3A" + utcMomentObject.format("ss") + "%2B00%3A00&subject=" + info.title;
  return outlookCalendarUrl;
}

export const getOutlookOfficeCalendarUrl = (info: CalendarEventObj) => {
  let utcStartObject = moment(new Date(info.eventStartDate)).utc();
  let utcEndObject = moment(new Date(info.eventEndDate)).utc();
  let outlookCalendarUrl = `https://outlook.office.com/owa/?path=/calendar/action/compose&rrv=addevent&startdt=${utcStartObject.format("YYYY-MM-DDTHH")}&enddt=${utcEndObject.format("YYYY-MM-DDTHH")}&location=%20${info.address},%20${info.city},%20${info.state},%20${info.zip},%20${info.country}&subject=${info.title}&body`;
  // let outlookCalendarUrl = "https://outlook.live.com/calendar/0/action/compose?allday=false&body=" + encodeURIComponent(info.title) + "&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=" + utcMomentObject.format("YYYY-MM-DDTHH") + "%3A" + utcMomentObject.format("mm") + "%3A" + utcMomentObject.format("ss") + "%2B00%3A00&subject=" + info.title;
  return outlookCalendarUrl;
}
export const getiCalendarUrl = (info: CalendarEventObj) => {
  let utcMomentObject = moment(new Date(info.eventStartDate)).utc();
  const icalendarUrl = `webcal://charlee.ai/blogs/events/${info.title}/?ical=1`
  // let icsFileContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:AXION-MEETINGS\nMETHOD:REQUEST\nBEGIN:VEVENT\nDTSTART:" + utcMomentObject.format("YYYYMMDDTHHmmss") + "Z\n" + "ORGANIZER;CN=Hive Calendar:mailto: \nUID:" + info.venueId + "\nSEQUENCE:0\nDTSTAMP:" + moment().utc().format("YYYYMMDDTHHmmss") + "Z\nSUMMARY:" + info.title + "\nLOCATION:Hive Meeting System\nDESCRIPTION:" + info.title.replaceAll("\n", "\\n") + "\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR";
  // let icsFileUrl = "data:text/calendar;charset=utf8," + encodeURIComponent(icsFileContent);
  return icalendarUrl;
}