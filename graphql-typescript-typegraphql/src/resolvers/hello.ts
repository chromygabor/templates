import { Resolver, Query, ObjectType, Field } from 'type-graphql'
import { Response } from '../utils'

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class HelloResponse extends Response(String, FieldError) {}

@Resolver()
export class HelloResolver {
  @Query(() => HelloResponse)
  hello(): HelloResponse {
    return HelloResponse.success('Hello World2')
  }
}
