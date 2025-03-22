# algorithm/main.py
from data import load_mock_users
from similarity import preprocess_users, compute_similarity
from weights import adjust_weights
import pandas as pd


def main():
    # Load mock data
    users_df = load_mock_users()

    # Preprocess users into feature vectors
    processed_users = preprocess_users(users_df)

    # Initial weights (subjects, availability, learning_style)
    weights = {"subjects": 0.5, "availability": 0.3, "learning_style": 0.2, "location": 0.1}

    # Compute similarity matrix
    similarity_matrix = compute_similarity(processed_users, weights)

    # Example: Find top matches for user 0
    user_id = 0
    similarities = similarity_matrix[user_id]
    top_matches = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[1:4]  # Exclude self

    print(f"Top matches for user {users_df.iloc[user_id]['id']}:")
    for match in top_matches:
        print(f"User {users_df.iloc[match[0]]['id']} - Score: {match[1]:.2f}")

    # Simulate feedback and adjust weights
    new_weights = adjust_weights(5, weights)  # Assume a 5-star rating
    print("\nAdjusted weights:", new_weights)


if __name__ == "__main__":
    main()