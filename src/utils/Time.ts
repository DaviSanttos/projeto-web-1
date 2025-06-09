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

  static toBrazilTime(date: Date): Date {
    const result = new Date(date);
    result.setHours(result.getHours() - 3);
    return result;
  }
}
