import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = (plain: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(plain, salt, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });

export const comparePassword = bcrypt.compare;
