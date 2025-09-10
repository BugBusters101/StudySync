from .similarity import preprocess_users, compute_similarity
from .weights import QLearningWeightAdjuster
import pandas as pd


def initialize_algorithm(all_profiles):
    users_df = pd.DataFrame(all_profiles)
    print(users_df["subjects"])
    processed_users = preprocess_users(users_df)

    q_agent = QLearningWeightAdjuster(
        initial_weights={"subjects": 0.5, "availability": 0.3, "days_of_week" : 0.4, "learning_style": 0.2, "location_type": 0.8, "location_details": 0.6},
    )

    return users_df, processed_users, q_agent


def find_top_matches(user_id, similarity_matrix, users_df, top_k=3):
    """
    Find top-k matches for a given user.

    Args:
        user_id (int): The user_id of the user.
        similarity_matrix (numpy.ndarray): The similarity matrix.
        users_df (pd.DataFrame): DataFrame containing user profiles.
        top_k (int): Number of top matches to return.

    Returns:
        list: A list of dictionaries containing match details.
    """
    user_id_to_index = {user_id: index for index, user_id in enumerate(users_df["user_id"])}

    user_index = user_id_to_index.get(user_id)
    if user_index is None:
        raise ValueError(f"User ID {user_id} not found in users_df")

    if user_index >= similarity_matrix.shape[0]:
        raise ValueError(f"User index {user_index} is out of bounds for similarity matrix with size {similarity_matrix.shape[0]}")

    similarities = similarity_matrix[user_index]
    top_matches = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[1:top_k + 1]
    matches = []
    for match in top_matches:
        match_index = match[0] 
        match_score = match[1]

        match_user_id = users_df.iloc[match_index]["user_id"]
        shared_subjects = list(set(users_df.iloc[user_index]["subjects"]) & set(users_df.iloc[match_index]["subjects"]))

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

    return 4 


def run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3):
    """Run the feedback loop to update weights and improve matches."""
    for i in range(num_iterations):
        similarity_matrix = compute_similarity(processed_users, q_agent.q_table)

        user_id = 0
        top_matches = find_top_matches(user_id, similarity_matrix, users_df, top_k=3)

        feedback = simulate_feedback(user_id, top_matches, users_df)
        new_weights = q_agent.update_weights(feedback)
        print(f"\n🔄 Updated weights: {new_weights}")


def main():
    """Main function to run the study buddy matching algorithm."""
    users_df, processed_users, q_agent = initialize_algorithm()
    run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3)


if __name__ == "__main__":
    main()