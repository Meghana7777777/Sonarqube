export class CommonInfoService {


  //METHOD TO CALICUALTE INSPECTION REQUEST AGE  
  static getRequestAge = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    // Reset hours/minutes/seconds/milliseconds to 0 for day calculation only
    const createdDateAtMidnight = new Date(createdDate);
    createdDateAtMidnight.setHours(0, 0, 0, 0);

    const nowAtMidnight = new Date(now);
    nowAtMidnight.setHours(0, 0, 0, 0);

    // Calculate full days difference ignoring time portion
    const diffInDays = Math.floor((nowAtMidnight.getTime() - createdDateAtMidnight.getTime()) / (1000 * 3600 * 24));

    // Calculate total seconds difference including time portion
    let diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    // Subtract full days (in seconds) from total difference to get remainder time of last day
    diffInSeconds -= diffInDays * 24 * 3600;

    const hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds %= 3600;

    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return diffInDays > 0
      ? `${diffInDays} day${diffInDays > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''}`;


  };
}
