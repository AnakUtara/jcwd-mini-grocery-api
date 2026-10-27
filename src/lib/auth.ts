import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../db/client.ts";
import { Role } from "../generated/prisma/enums.ts";
import { IS_PROD } from "../configs/env.config.ts";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: Role.CUSTOMER,
				required: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
});
