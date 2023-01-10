import User from "model/User";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";

interface ResponseData {
  error?: string;
  msg?: string;
}

const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email) || !email;
};

const validatePhone = (phone: string): boolean => {
  const regEx = /\+[\d]*/i;
  return regEx.test(phone) || !phone;
};

const validateForm = async (name: string, email: string, phone: string) => {
  if (name.length < 3) {
    return { error: "Name must have 3 or more characters" };
  }
  if (!validateEmail(email)) {
    return { error: "Email is invalid" };
  }
  if (!validatePhone(phone)) {
    return { error: "Phone number is invalid. Try adding the prefix" };
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "This API call only accepts POST methods" });
  }

  const { telegramId, name, email, phone } = req.body;

  const errorMessage = await validateForm(name, email, phone);

  if (errorMessage) {
    return res.status(400).json(errorMessage as ResponseData);
  }

  await dbConnect();
  const telegramIdUser = await User.findOneAndUpdate({ telegramId }, {name, email, phone});

  if (!telegramIdUser) {
    return res.status(400).json({ error: "Telegram ID not found" } as ResponseData);
  }

  return res.status(200).json({ msg: "Successfuly update user " + telegramIdUser.telegramId })
}
