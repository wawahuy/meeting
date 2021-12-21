import * as moment from 'moment';

export function computeOnlineTime(date: Date) {
  const c = moment();
  const t = moment(date);

  let r = '';
  let d = c.diff(t, 'seconds');
  if (d <= 60) {
    r = d + ' seconds';
  } else {
    d = c.diff(t, 'minutes');
    if (d <= 60) {
      r = d + ' minutes';
    } else {
      d = c.diff(t, 'hours');
      if (d <= 24) {
        r = d + ' hours';
      } else {
        d = c.diff(t, 'days');
        if (d <= 30) {
          r = d + ' days';
        }
      }
    }
  }

  return `Online ${r} ago`;
}
export function autoScrollBottom(id: string) {
  window.setInterval(() => {
    let elem = document.getElementById(id);
    elem.scrollTop = elem.scrollHeight;
  });
}
