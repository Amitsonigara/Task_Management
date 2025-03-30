using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace TaskManagement.Common.Helper.PasswordHelper
{
    public class CommonHelper
    {
        // Verify Password by comparing hash of entered password and stored hash + salt
        public bool VerifyPassword(string loginPassword, string storedHash)
        {
            var parts = storedHash.Split('$');
            var storedSalt = Convert.FromBase64String(parts[0]); // Extract the stored salt
            var storedPasswordHash = parts[1]; // Extract the stored password hash

            // Generate the hash of the entered password using the stored salt
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: loginPassword,
                salt: storedSalt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hash == storedPasswordHash; // Compare the hashes
        }

        // Hash Password and generate salt, return salt$hash format
        public string HashPassword(string password)
        {
            byte[] salt = new byte[16]; // Create a new random salt
            new Random().NextBytes(salt); // Fill salt with random bytes

            // Generate the hash using the password and the salt
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            // Combine the salt and hash into the format: salt$hash
            return Convert.ToBase64String(salt) + "$" + hashed;
        }
    }

}
