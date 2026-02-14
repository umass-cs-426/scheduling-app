// The ValidatedEventDto represents event data after validation.
// It helps us mark the boundary between "raw input" and "trusted data."
export interface ValidatedEventDto {
  title: string
  date: string
}

export function ValidatedEventDto(
  title: string,
  date: string,
): ValidatedEventDto {
  return { title, date }
}
