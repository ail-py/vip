
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { NewUser, User } from './schema';

export const getAllUsers = async (db: DrizzleD1Database): Promise<User[]> => {
    return await db.select().from(schema.users).all();
};

export const getUserByUuid = async (db: DrizzleD1Database, uuid: string): Promise<User | undefined> => {
    return await db.select().from(schema.users).where(eq(schema.users.uuid, uuid)).get();
};

export const createUser = async (db: DrizzleD1Database, user: NewUser): Promise<void> => {
    await db.insert(schema.users).values(user).run();
};

export const updateUser = async (db: DrizzleD1Database, uuid: string, user: Partial<NewUser>): Promise<void> => {
    await db.update(schema.users).set(user).where(eq(schema.users.uuid, uuid)).run();
};

export const deleteUser = async (db: DrizzleD1Database, uuid: string): Promise<void> => {
    await db.delete(schema.users).where(eq(schema.users.uuid, uuid)).run();
};
