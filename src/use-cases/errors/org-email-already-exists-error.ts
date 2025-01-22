export class OrgEmailAlreadyExistsError extends Error {
  constructor() {
    super('An Org already exists registered with this email!')
  }
}
