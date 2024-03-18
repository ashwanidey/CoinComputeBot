function convertToEpochTime(isoTimestamp) {
  const date = new Date(isoTimestamp);
  return date.getTime(); // Returns epoch time in milliseconds
}