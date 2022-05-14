const converterMinutesToDuration = (time) => {
  let duration = '';
  const hours = Math.trunc(time / 60);
  const minutes = time % 60;
  duration += hours ? `${hours}h ` : '';
  duration += minutes ? `${minutes}m` : '';
  return duration;
};


export {converterMinutesToDuration};
