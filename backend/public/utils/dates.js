const getTimeZoneOffset = () => {
  return new Date().getTimezoneOffset() * 60000;
}

const getCurrentDate = () => {
  const timeZoneOffset = getTimeZoneOffset();
  return new Date(new Date() - timeZoneOffset);
}

module.exports = {
  getCurrentDate,
  getTimeZoneOffset
}