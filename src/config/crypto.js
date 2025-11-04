import * as bcrypt from "bcrypt";
import * as dotenv from 'dotenv';

dotenv.config();
const saltRounds = parseInt(process.env?.SALT_ROUNDS || '10');
const saltValue = process.env?.SALT_VALUE;

export class CryptoManager {
    static async generateSalt() {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            console.log(`Insira no .env:
            SALT_VALUE=${salt}
            `)
        } catch(e) {
            console.error(e);
        }
    }

    static async generateHash(data) {
        try {
            const hash = await bcrypt.hash(data, saltValue);
            return hash;
        } catch(e) {
            console.error(e)
            throw Error("Não foi possível gerar o hash da senha!")
        }
    }

    static async compareHash(data, hash) {
        try {
            return await bcrypt.compare(data, hash);
        } catch(e) {
            console.error(e);
            return false;
        }
    }
}

export const verifySalt = () => {
    if (!saltValue)
        CryptoManager.generateSalt();
}