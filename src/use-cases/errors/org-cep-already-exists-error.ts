export class OrgCepAlreadyExistsError extends Error {
  constructor() {
    super('An Org already exists registered with this cep!')
  }
}
