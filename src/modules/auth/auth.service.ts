import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email }).lean();
}

export async function findUserById(id: string) {
  await connectDB();
  return User.findById(id).lean();
}

export async function createUser(data: { name: string; email: string; password: string }) {
  await connectDB();
  const hashed = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashed,
  });
  return { id: user._id.toString(), name: user.name, email: user.email };
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
