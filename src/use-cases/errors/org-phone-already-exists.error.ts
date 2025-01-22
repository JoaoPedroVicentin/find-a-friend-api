export class OrgPhoneAlreadyExistsError extends Error {
  constructor() {
    super('An Org already exists registered with this phone!')
  }
}
