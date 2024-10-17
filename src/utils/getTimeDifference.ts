import { Timestamp } from "firebase/firestore";

export default function getTimeDifference(timestamp: Timestamp): string {
  const now = new Date();
  const timestampDate = timestamp.toDate();

  const diffInMilliseconds = now.getTime() - timestampDate.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInSeconds < 60) {
    return `< 1 min.`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min.`;
  } else if (diffInHours < 24) {
    return `${diffInHours} h.`;
  } else if (diffInDays < 30) {
    return `${diffInDays} d.`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} mon.`;
  } else {
    return `${diffInYears} y.`;
  }
}
