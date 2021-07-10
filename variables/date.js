import { format } from 'date-fns-tz';

export const formatUtcToJapanTimeZone = (dt) => {
    const date = new Date(dt);
    // date-fns-tz の utcToZonedTime がうまく動かないので9時間足す
    return format(date, 'yyyy-MM-dd HH:mm:ss zzz', {timeZone: 'Asia/Tokyo'});
}