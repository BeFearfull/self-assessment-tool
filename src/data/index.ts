import type { MockTest } from '../types'
import mock1 from './mock1.json'
import mock2 from './mock2.json'
import mock3 from './mock3.json'
import mock4 from './mock4.json'
import mock5 from './mock5.json'
import mock6 from './mock6.json'
import mock7 from './mock7.json'
import mock8 from './mock8.json'
import mock9 from './mock9.json'
import mock10 from './mock10.json'

export const MOCKS: MockTest[] = [
  mock1,
  mock2,
  mock3,
  mock4,
  mock5,
  mock6,
  mock7,
  mock8,
  mock9,
  mock10,
] as MockTest[]

export function getMock(id: string): MockTest | undefined {
  return MOCKS.find((m) => m.id === id)
}
