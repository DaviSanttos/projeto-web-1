export class Time {
  static nowInBrazil(): Date {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    return now;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
