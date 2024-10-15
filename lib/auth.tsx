import { Sheet, SpreadsheetId } from "@/lib/CommonApiCall";
import { User } from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const range = "User";
                const response = await Sheet.spreadsheets.values.get({
                    spreadsheetId: SpreadsheetId,
                    range,
                    valueRenderOption: "FORMULA",
                });

                const rows = response.data.values;
                if (rows) {
                    const headers = rows[0];
                    const data = rows.slice(1).map((row) => {
                        let rowData: { [key: string]: string | null } = {};
                        headers.forEach((header, index) => {
                            rowData[
                                header
                                    .toLowerCase()
                                    .trim()
                                    .replace(/ /g, "_")
                                    .replace(".", "")
                            ] = row.length > index ? row[index] : "";
                        });
                        return rowData;
                    });

                    const users: User[] = data.map(
                        (item) => new User({ ...item })
                    );

                    const user = users.find(
                        (user) =>
                            user.email == credentials?.username &&
                            user.password == credentials.password
                    );

                    if (user) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            barcode: user.barcode,
                        };
                    }
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};
