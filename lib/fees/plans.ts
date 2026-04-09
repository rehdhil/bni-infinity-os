export function isTermStart(date: Date): boolean {
  const month = date.getMonth() + 1 // 1-indexed
  return month === 4 || month === 10
}

export function getTermDates(date: Date): { start: Date; end: Date } {
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  if (month >= 4 && month <= 9) {
    return {
      start: new Date(`${year}-04-01`),
      end: new Date(`${year}-09-30`),
    }
  } else if (month >= 10) {
    return {
      start: new Date(`${year}-10-01`),
      end: new Date(`${year + 1}-03-31`),
    }
  } else {
    // Jan–Mar
    return {
      start: new Date(`${year - 1}-10-01`),
      end: new Date(`${year}-03-31`),
    }
  }
}

export function getMemberMonthlyDue(hasTermPlan: boolean): number {
  return hasTermPlan ? 0 : 2500
}
