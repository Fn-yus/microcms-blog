import { format } from 'date-fns-tz';

export const formatUtcToJapanTimeZone = (dt) => {
    const date = new Date(dt);
    return format(date, 'yyyy.MM.dd', {timeZone: 'Asia/Tokyo'});
}