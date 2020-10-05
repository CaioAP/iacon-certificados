exports.formatPeriodMMAAAA = (period, separator) => {
  const periodParts = period.split('/');
  if (separator) {
    return periodParts[0] + separator + periodParts[1];
  } else {
    return periodParts[0] + periodParts[1];
  }
}