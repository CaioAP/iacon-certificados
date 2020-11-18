exports.formatPeriodMMAAAA = (period, separator) => {
  const year = String(period).substr(0, 4);
  const month = String(period).substr(4, 2);

  return month + separator + year;
}

exports.unformatPeriodAAAAMM = (period, separator) => {
  const periodParts = period.split(separator);
  let periodAAAAMM = '';

  periodParts.slice().reverse().forEach((part, index) => {
    if (index < 2) periodAAAAMM += part;
  })

  return parseInt(periodAAAAMM);
}