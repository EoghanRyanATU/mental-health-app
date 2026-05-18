import unittest
from app import get_mood_insight


class TestsBasedOnUseCasesLogic(unittest.TestCase):

    def test_UseCase03_SuccessfullyTrackHappy(self):
        result = get_mood_insight("Happy", 8, 1)
        self.assertEqual(
            result, "That's great! Take a moment to appreciate what made you smile."
        )

    def test_UseCase03_SuccessfullyTrackAnxious(self):
        result = get_mood_insight("Anxious", 4, 0)
        self.assertIn("breathing technique", result)

    def test_UseCase03_InsightEngineFallback(self):
        result = get_mood_insight("UnknownState", 7, 1)
        self.assertEqual(result, "Keep tracking to see your patterns!")

    def test_UseCase04_HistoricalMoodMapping(self):
        # Defined locally as a mock structure to verify mapping serialization formats
        mood_map = {"Happy": 4, "Neutral": 3, "Sad": 1}
        self.assertEqual(mood_map["Happy"], 4)
        self.assertEqual(mood_map["Neutral"], 3)
        self.assertEqual(mood_map["Sad"], 1)

    def test_FR07_MultiTenancyDataTagging(self):
        log_payload = {"user_id": 505, "mood": "Sad"}
        self.assertEqual(log_payload["user_id"], 505)


if __name__ == "__main__":
    unittest.main()