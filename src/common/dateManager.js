function isLeap(year) {
  if (year % 100 === 0) {
    if (year % 400 === 0) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (year % 4 === 0) {
    return true;
  }
  else {
    return false;
  }
}

function getDayCount(year, month) {
  let _31 = [1, 3, 5, 7, 8, 10, 12].map(elem => --elem);
  let _30 = [4, 6, 9, 11].map(elem => --elem);
  if (_31.includes(month)) {
    return 31;
  }
  else if (_30.includes(month)) {
    return 30;
  }
  else {
    if (isLeap(year)) {
      return 29;
    }
    else {
      return 28;
    }
  }
}

function addYear(d, n) {
  let { year, month, day } = getYMD(d);
  return new Date(year + n, month, day);
}

function addMonth(d, n) {
  let { year, month, day } = getYMD(d);
  return new Date(year, month + n, day);
}

function getYMD(d) {
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    week: d.getDay(),
    get ymd() { return new Date(this.year, this.month, this.day); }
  };
}

export default {
  isLeap,
  getDayCount,
  addYear,
  addMonth,
  getYMD
};
