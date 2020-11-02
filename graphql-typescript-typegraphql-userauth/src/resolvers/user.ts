import argon2 from 'argon2'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { v4 as uuid } from 'uuid'
import { COOKIE_NAME } from '../constants'
import { IUser } from '../schemas/User'
import { MyContext } from '../types'
import { Response } from '../utils'

@InputType()
class UserInput {
  @Field({ nullable: true })
  username: string
  @Field({ nullable: true })
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse extends Response(IUser, FieldError) {}

@Resolver()
export class UserResolver {
  @Query(() => IUser, { nullable: true })
  me(@Ctx() { db, session }: MyContext): IUser {
    const id = session?.userId
    if (!id) {
      return null
    }

    const user = db.get('users', []).find({ _id: id }).value() as IUser

    return user
  }

  @Query(() => [IUser])
  users(@Ctx() { db }: MyContext): Promise<IUser[]> {
    return new Promise<IUser[]>((resolve, reject) => {
      try {
        const res = db.get('users', []).value()
        resolve(res)
      } catch (error) {
        reject(error)
      }
    })
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('userInput') userInput: UserInput,
    @Ctx() { db }: MyContext
  ): Promise<UserResponse> {
    if (userInput.password.length < 3) {
      return UserResponse.failure({
        field: 'password',
        message: 'password must be at least 3 characters long',
      })
    }

    const hashedPassword = await argon2.hash(userInput.password)

    const userDraft: IUser = {
      _id: uuid(),
      username: userInput.username,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    try {
      const User = db.get('users', [])
      const u = User.find({ username: userInput.username }).value()
      console.log(u)
      if (u) {
        throw Error('duplicate key')
      }

      db.get('users', []).push(userDraft).write()

      return UserResponse.success(userDraft)
    } catch (err) {
      let error
      if (err.message.toLowerCase().includes('duplicate key')) {
        error = 'username is already taken'
      } else {
        error = err.message
      }
      return UserResponse.failure({
        field: 'username',
        message: error,
      })
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('userInput') userInput: UserInput,
    @Ctx() { db, session }: MyContext
  ): Promise<UserResponse> {
    const User = db.get('users', [])
    const user = User.find({ username: userInput.username }).value()
    if (!user) {
      return UserResponse.failure({
        field: 'username',
        message: "username doesn't exists",
      })
    }
    const valid = await argon2.verify(user.password, userInput.password)
    if (!valid) {
      return UserResponse.failure({
        field: 'password',
        message: 'password is incorrectf',
      })
    }
    session.userId = user._id
    return UserResponse.success(user)
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) resolve(false)
        else resolve(true)
      })
    })
  }
}
