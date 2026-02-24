export class EventsPage {
    ConvertDayToString(n: number) {
        switch (n) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            default:
                return null;
        }
    }
}

const monthMap: { [key: string]: string } = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function reformatDate(dateStr: string): string {
  const parts = dateStr.split(" ");
  if (parts.length !== 3) return '1970-01-01';
  const day = parts[0];
  const month = monthMap[parts[1]];
  const year = parts[2];
  if (!month) return '1970-01-01';
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

export function parseCustomDate(dateStr: string): Date {
    const isoDateStr = reformatDate(dateStr);
    return new Date(`${isoDateStr}T00:00:00Z`);
}
