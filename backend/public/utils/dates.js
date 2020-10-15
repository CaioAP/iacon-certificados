exports.getCurrentDateTimeISOString = () => {
  const dateTime = new Date();
  return dateTime.toISOString();
}