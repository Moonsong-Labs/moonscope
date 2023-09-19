export const currentTz = () => {
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
    const minutes = Math.abs(timezoneOffsetMinutes) % 60;
    const hoursString = (hours < 10 ? "0" : "") + hours;
    const minutesString = (minutes < 10 ? "0" : "") + minutes;
  
    // Construct the timezone offset string
    const timezoneOffsetString = (timezoneOffsetMinutes > 0 ? "-" : "+") + hoursString + minutesString;
    return `GMT${timezoneOffsetString}`;
  };