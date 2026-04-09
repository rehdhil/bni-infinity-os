import { isTermStart, getTermDates, getMemberMonthlyDue } from '../plans'
import { calculateBalance } from '../balance'

describe('isTermStart', () => {
  test('April is a term start month', () => {
    expect(isTermStart(new Date('2026-04-01'))).toBe(true)
  })

  test('October is a term start month', () => {
    expect(isTermStart(new Date('2026-10-01'))).toBe(true)
  })

  test('June is not a term start month', () => {
    expect(isTermStart(new Date('2026-06-01'))).toBe(false)
  })
})

describe('getTermDates', () => {
  test('April returns Apr-Sep term', () => {
    const { start, end } = getTermDates(new Date('2026-04-15'))
    expect(start.toISOString().slice(0, 10)).toBe('2026-04-01')
    expect(end.toISOString().slice(0, 10)).toBe('2026-09-30')
  })

  test('November returns Oct-Mar term', () => {
    const { start, end } = getTermDates(new Date('2026-11-15'))
    expect(start.toISOString().slice(0, 10)).toBe('2026-10-01')
    expect(end.toISOString().slice(0, 10)).toBe('2027-03-31')
  })
})

describe('calculateBalance', () => {
  test('standard member with no payments owes 2500', () => {
    const balance = calculateBalance({
      unpaidMeetings: 1,
      unpaidFees: 0,
      hasTermPlan: false,
      monthlyRate: 2500,
    })
    expect(balance).toBe(2500)
  })

  test('member with term plan owes only one-time fees', () => {
    const balance = calculateBalance({
      unpaidMeetings: 1,
      unpaidFees: 5000,
      hasTermPlan: true,
      monthlyRate: 2500,
    })
    expect(balance).toBe(5000)
  })

  test('member with arrears owes multiple months', () => {
    const balance = calculateBalance({
      unpaidMeetings: 3,
      unpaidFees: 0,
      hasTermPlan: false,
      monthlyRate: 2500,
    })
    expect(balance).toBe(7500)
  })

  test('member with term plan and one-time fees owes only fees', () => {
    const balance = calculateBalance({
      unpaidMeetings: 2,
      unpaidFees: 10000,
      hasTermPlan: true,
      monthlyRate: 2500,
    })
    expect(balance).toBe(10000)
  })
})
