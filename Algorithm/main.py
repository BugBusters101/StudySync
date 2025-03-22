from .data import load_mock_users
from .similarity import preprocess_users, compute_similarity
from .weights import QLearningWeightAdjuster
import pandas as pd


def initialize_algorithm():
    """Initialize the algorithm with default weights and load data."""
    # Load user data
    users_df = load_mock_users()

    # Preprocess user preferences into feature vectors
    processed_users = preprocess_users(users_df)

    # Initialize Q-learning agent with default weights
    q_agent = QLearningWeightAdjuster(
        initial_weights={"subjects": 0.5, "availability": 0.3, "days_of_week" : 0.4, "learning_style": 0.2, "location": 0.8}
    )

    return users_df, processed_users, q_agent


def find_top_matches(user_id, similarity_matrix, users_df, top_k=3):
    """
    Find top-k matches for a given user.

    Args:
        user_id (int): The index of the user in the similarity matrix.
        similarity_matrix (numpy.ndarray): The similarity matrix.
        users_df (pd.DataFrame): DataFrame containing user profiles.
        top_k (int): Number of top matches to return.

    Returns:
        list: A list of dictionaries containing match details.
    """
    similarities = similarity_matrix[user_id]
    top_matches = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[1:top_k + 1]  # Skip self

    # Prepare match details
    matches = []
    for match in top_matches:
        match_user_id = users_df.iloc[match[0]]["id"]
        match_score = match[1]
        shared_subjects = list(set(users_df.iloc[user_id]["subjects"]) & set(users_df.iloc[match[0]]["subjects"]))

        matches.append({
            "match_user_id": match_user_id,
            "score": match_score,
            "shared_subjects": shared_subjects
        })

    return matches


def simulate_feedback(user_id, top_matches, users_df):
    """Simulate user feedback for top matches (e.g., 1-5 stars)."""
    print(f"\n🎯 Top match(es) for User {users_df.iloc[user_id]['id']}:")
    for match in top_matches:
        print(f"User {match['match_user_id']} - Score: {match['score']:.2f}")

    # Simulate feedback (e.g., 4/5 stars for all matches)
    return 4  # Replace with actual user input in a real app


def run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3):
    """Run the feedback loop to update weights and improve matches."""
    for i in range(num_iterations):
        # Compute similarity matrix with current weights
        similarity_matrix = compute_similarity(processed_users, q_agent.q_table)

        # Find top matches for user 0
        user_id = 0
        top_matches = find_top_matches(user_id, similarity_matrix, users_df, top_k=3)

        # Simulate feedback and update weights
        feedback = simulate_feedback(user_id, top_matches, users_df)
        new_weights = q_agent.update_weights(feedback)
        print(f"\n🔄 Updated weights: {new_weights}")


def main():
    """Main function to run the study buddy matching algorithm."""
    # Step 1: Initialize data and algorithm
    users_df, processed_users, q_agent = initialize_algorithm()

    # Step 2: Run feedback loop to improve matches
    run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3)


if __name__ == "__main__":
    main()