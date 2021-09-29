import { format } from 'date-fns-tz';

export const formatUtcToJapanTimeZone = (dt) => {
    const date = new Date(dt);
    return format(date, 'yyyy-MM-dd HH:mm:ss zzz', {timeZone: 'Asia/Tokyo'});
}