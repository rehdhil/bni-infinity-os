interface BalanceInput {
  unpaidMeetings: number
  unpaidFees: number
  hasTermPlan: boolean
  monthlyRate: number
}

export function calculateBalance({
  unpaidMeetings,
  unpaidFees,
  hasTermPlan,
  monthlyRate,
}: BalanceInput): number {
  const meetingsDue = hasTermPlan ? 0 : unpaidMeetings * monthlyRate
  return meetingsDue + unpaidFees
}
