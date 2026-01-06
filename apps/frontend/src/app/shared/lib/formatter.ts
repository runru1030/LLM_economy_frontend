import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

const humantime = (date: Date) => {
  try {
    if (!date) {
      return "";
    }
    return formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: ko,
    });
  } catch (error) {
    console.error(error);
    return "";
  }
};
export { humantime };
