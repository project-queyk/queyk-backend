import z from "zod";
import validator from "validator";

export const mobilePhoneNumberSchema = z
  .string()
  .refine((val) => validator.isMobilePhone(val, "en-PH"), {
    message: "Invalid mobile phone number for en-PH locale",
  });
