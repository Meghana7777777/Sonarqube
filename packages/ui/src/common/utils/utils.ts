
import { sizesOrderArray } from '@xpparel/shared-models';
import moment from 'moment';

export const camelize = (string: string): string => {
  return string
    .split(' ')
    .map((word, index) => (index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)))
    .join('');
};


type MarkArea = {
  xAxis: number;
};

export const getMarkAreaData = (data: string[] | number[]): MarkArea[][] =>
  data.map((el, index) => [
    {
      xAxis: 2 * index,
    },
    {
      xAxis: 2 * index + 1,
    },
  ]);

export const capitalize = (word: string): string => `${word[0].toUpperCase()}${word.slice(1)}`;

export const hexToRGB = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};

export const getDifference = (value: number, prevValue: number): string | null =>
  prevValue !== 0 ? `${((Math.abs(value - prevValue) / prevValue) * 100).toFixed(0)}%` : '100%';

export const normalizeProp = (prop: string | number | [number, number]): string =>
  typeof prop === 'number' ? `${prop}px` : (Array.isArray(prop) && `${prop[0]}px ${prop[1]}px`) || prop.toString();


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeBy = (a: any[], b: any[], key: string): any[] =>
  a.filter((elem) => !b.find((subElem) => subElem[key] === elem[key])).concat(b);

export const getSmoothRandom = (factor: number, start: number): number => {
  const halfEnvelope = 1 / factor / 2;
  const max = Math.min(1, start + halfEnvelope);
  const min = Math.max(0, start - halfEnvelope);

  return Math.random() * (max - min) + min;
};

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error('Non valid HEX color');
  }
};

export const formatNumberWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const msToH = (ms: number): number => Math.floor(ms / 3600000);

export const hToMS = (h: number): number => h * 3600000;

export const getPaymentCardTypeIcon = (type: string): string | null => {
  switch (type) {
    // case 'visa':
    //   return visa;
    // case 'mastercard':
    //   return mastercard;
    // case 'maestro':
    //   return maestro;
    case 'amex':
      return 'amex';
    case 'discover':
      return 'discover';
    case 'diners':
      return 'diners';
    case 'jcb':
      return 'jcb';
    case 'unionpay':
      return 'unionpay';
    default:
      return null;
  }
};

export const formatTime = (time) => {
  if (time) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `00:00:00`;
  }
}

export const disabledBackDates = (current: moment.Moment, fromDate: string, disableCurrent: boolean = false) => {
  // Disable all dates that are before today
  if (disableCurrent) {
    return current && current < moment(fromDate, "YYYY-MM-DD").endOf('day');
  } else {
    return current && current < moment(fromDate, "YYYY-MM-DD").startOf('day');
  }
};

export const disabledNextDates = (current: moment.Moment, fromDate: string, disableCurrent: boolean = false) => {
  // Disable all dates that are before today
  if (disableCurrent) {
    return current && current > moment(fromDate, "YYYY-MM-DD").endOf('day');
  } else {
    return current && current > moment(fromDate, "YYYY-MM-DD").endOf('day');
  }
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
export const disabledDateTime = (fromDate: moment.Moment, current?: moment.Moment,) => {
  if (fromDate.isSame(current, 'day')) {
    const hours = fromDate.hour();
    const minutes = fromDate.minute();
    const seconds = fromDate.second();
    console.log(hours, minutes, seconds)
    return {
      disabledHours: () => range(0, 24).splice(0, hours),
      disabledMinutes: () => range(0, minutes),
      disabledSeconds: () => [0, seconds]
    }
  } else {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => []
    }
  }
};

export const returnZeroIfNaN = (value) => {
  return isNaN(value) ? 0 : value;
};

// should the backend returned timestamp as is
export const convertBackendDateToLocalTimeZone = (dateTime: string, iNeedOnlyDate?: boolean) => {
  if (iNeedOnlyDate) {
    return moment(dateTime).format('YYYY-MM-DD');
  } else {
    // 24H format
    return moment(dateTime).format('YYYY-MM-DD hh:mm A');
  }
}


export const sortSizes = (sizes: string[], orderBy: "ASC" | "DESC" = "ASC"): string[] => {
  const orderMap = new Map<string, number>();

  sizesOrderArray.forEach((size, index) => {
    orderMap.set(size.toUpperCase(), index);
  });

  return sizes.slice().sort((a, b) => {
    const indexA = orderMap.has(a.toUpperCase()) ? orderMap.get(a.toUpperCase())! : Infinity;
    const indexB = orderMap.has(b.toUpperCase()) ? orderMap.get(b.toUpperCase())! : Infinity;

    if (orderBy === "ASC") {
      return indexA - indexB;
    } else {
      return indexB - indexA;
    }
  });
};

