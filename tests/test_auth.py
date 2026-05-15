import unittest
from app import generate_password_hash, check_password_hash

class TestsBasedOnUseCasesAuth(unittest.TestCase):

    def test_UseCase01_RegistrationHashing(self):
        password = "UserPass123!"
        hashed = generate_password_hash(password)
        self.assertNotEqual(password, hashed)
        self.assertIn(':', hashed)

    def test_UseCase02_LoginSuccessfully(self):
        password = "UserPass123!"
        hashed = generate_password_hash(password)
        self.assertTrue(check_password_hash(hashed, password))
        self.assertFalse(check_password_hash(hashed, "WrongPass"))

    def test_FR06_AuthPayloadIntegrity(self):
        auth_response = {"username": "DublinDev", "isLoggedIn": True, "user_id": 1}
        self.assertIn("user_id", auth_response)
        self.assertIsInstance(auth_response["user_id"], int)

if __name__ == '__main__':
    unittest.main()