type RelativeDate = string

function getRelativeDateHint(date: Date) {
  const today = new Date()
  if (date.getDate() === today.getDate()) {
    return 'Today'
  }
  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.getDate() === yesterday.getDate()) {
    return 'Yesterday'
  }
  for (let i = 2; i < 7; ++i) {
    let n_days_before = new Date()
    n_days_before.setDate(n_days_before.getDate() - i)
    if (date.getDate() === n_days_before.getDate()) {
      return `${i} days before`
    }
  }
  for (let i = 1; i < 4; ++i) {
    let n_weeks_before = new Date()
    n_weeks_before.setDate(n_weeks_before.getDate() - 7 * (i + 1))
    if (date.getDate() >= n_weeks_before.getDate()) {
      return `${i} weeks before`
    }
  }
  let last_month = new Date()
  last_month.setDate(last_month.getMonth() - 1)
  if (date.getDate() >= last_month.getDate()) {
    return 'Last month'
  }
  let last_year = new Date()
  last_year.setDate(last_year.getFullYear() - 1)
  if (date.getDate() >= last_year.getDate()) {
    return 'Last year'
  }
  return 'Few years before'
}

export class DateTraverser {
  public state: RelativeDate | null
  
  constructor() {
    this.state = null
  }

  public consume(date: Date) {
    let new_state: RelativeDate = getRelativeDateHint(date);
    if (new_state !== this.state) {
      let ret = this.state;
      this.state = new_state;
      return ret;
    } else {
      return null
    }
  }

  public checkLast() {
    return this.state != null
  }
}