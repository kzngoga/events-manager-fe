export const convertDateForInput = (date: number) => {
  const dt = new Date(date);
  const month = dt.getMonth() + 1;
  const dayNum = dt.getDate();

  return `${dt.getFullYear()}-${month > 9 ? month : "0" + month}-${
    dayNum > 9 ? dayNum : "0" + dayNum
  }`;
};

export const convertDateForTable = (date: number) => {
  const dt = new Date(date);

  return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
};
