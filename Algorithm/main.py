from data import load_mock_users
from similarity import preprocess_users, compute_similarity
from weights import QLearningWeightAdjuster


def initialize_algorithm():
    """Initialize the algorithm with default weights and load data."""
    # Load user data
    users_df = load_mock_users()

    # Preprocess user preferences into feature vectors
    processed_users = preprocess_users(users_df)

    # Initialize Q-learning agent with default weights
    q_agent = QLearningWeightAdjuster(
        initial_weights={"subjects": 0.5, "availability": 0.3, "learning_style": 0.2, "location": 0.8}
    )

    return users_df, processed_users, q_agent


def find_top_matches(user_id, similarity_matrix, users_df, top_k=1):
    """Find top-k matches for a given user."""
    similarities = similarity_matrix[user_id]
    top_matches = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[1:top_k + 1]  # Skip self
    return top_matches


def simulate_feedback(user_id, top_matches, users_df):
    """Simulate user feedback for top matches (e.g., 1-5 stars)."""
    print(f"\n🎯 Top match(es) for User {users_df.iloc[user_id]['id']}:")
    for match in top_matches:
        print(f"User {users_df.iloc[match[0]]['id']} - Score: {match[1]:.2f}")

    # Simulate feedback (e.g., 4/5 stars for all matches)
    return 4  # Replace with actual user input in a real app


def run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3):
    """Run the feedback loop to update weights and improve matches."""
    for i in range(num_iterations):
        # Compute similarity matrix with current weights
        similarity_matrix = compute_similarity(processed_users, q_agent.q_table)

        # Find top matches for user 0
        user_id = 0
        top_matches = find_top_matches(user_id, similarity_matrix, users_df, top_k=1)

        # Simulate feedback and update weights
        feedback = simulate_feedback(user_id, top_matches, users_df)
        new_weights = q_agent.update_weights(feedback)


def main():
    """Main function to run the study buddy matching algorithm."""
    # Step 1: Initialize data and algorithm
    users_df, processed_users, q_agent = initialize_algorithm()

    # Step 2: Run feedback loop to improve matches
    run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3)


if __name__ == "__main__":
    main()