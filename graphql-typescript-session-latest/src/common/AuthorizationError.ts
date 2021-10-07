import { ApolloError } from 'apollo-server-express'

export class AuthorizationError extends ApolloError {
  constructor() {
    super('UNAUTHORIZED', 'CODE_401')

    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}
