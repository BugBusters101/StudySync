from sklearn.metrics.pairwise import cosine_similarity
from .similarity import preprocess_users, compute_similarity
from .weights import QLearningWeightAdjuster
import pandas as pd


def initialize_algorithm(all_profiles):
    users_df = pd.DataFrame(all_profiles)
    processed_users = preprocess_users(users_df)

    q_agent = QLearningWeightAdjuster(
        initial_weights={"subjects": 0.5, "availability": 0.3, "days_of_week" : 0.4, "learning_style": 0.2, "location_type": 0.8, "location_details": 0.6},
    )

    return users_df, processed_users, q_agent


def find_top_matches(user_id, weighted_vectors, users_df, top_k=3):
    """
    Find top-k matches for a given user.

    Args:
        user_id (int): The user_id of the user.
        weighted_vectors (pd.DataFrame): The preprocessed weighted vectors.
        users_df (pd.DataFrame): DataFrame containing user profiles.
        top_k (int): Number of top matches to return.

    Returns:
        list: A list of dictionaries containing match details.
    """
    user_id_to_index = {user_id: index for index, user_id in enumerate(users_df["user_id"])}

    user_index = user_id_to_index.get(user_id)
    if user_index is None:
        raise ValueError(f"User ID {user_id} not found in users_df")

    if user_index >= weighted_vectors.shape[0]:
        raise ValueError(f"User index {user_index} is out of bounds with size {weighted_vectors.shape[0]}")

    # Compute similarity against all users for this specific user (O(N) instead of O(N^2))
    user_vector = weighted_vectors.iloc[[user_index]]
    similarities = cosine_similarity(user_vector, weighted_vectors)[0]
    top_matches = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[1:top_k + 1]
    matches = []
    for match in top_matches:
        match_index = match[0] 
        match_score = match[1]

        match_user_id = users_df.iloc[match_index]["user_id"]
        
        # Compute all overlapping fields
        user_row = users_df.iloc[user_index]
        match_row = users_df.iloc[match_index]
        
        shared_subjects = list(set(user_row.get("subjects", [])) & set(match_row.get("subjects", [])))
        shared_days = list(set(user_row.get("days_of_week", [])) & set(match_row.get("days_of_week", [])))
        shared_slots = list(set(user_row.get("availability", [])) & set(match_row.get("availability", [])))
        shared_style = list(set(user_row.get("learning_style", [])) & set(match_row.get("learning_style", [])))
        shared_location = list(set(user_row.get("location_type", [])) & set(match_row.get("location_type", [])))

        matches.append({
            "match_user_id": int(match_user_id),
            "first_name": match_row["first_name"],
            "last_name": match_row["last_name"],
            "shared_subjects": shared_subjects,
            "shared_days": shared_days,
            "shared_slots": shared_slots,
            "shared_style": shared_style,
            "shared_location": shared_location,
            "score": float(match_score)
        })

    return matches


def simulate_feedback(user_id, top_matches, users_df):
    """Simulate user feedback for top matches (e.g., 1-5 stars)."""
    # Fix IDOR by resolving proper row using loc instead of iloc
    user_row = users_df.loc[users_df['user_id'] == user_id]
    if user_row.empty:
        raise ValueError(f"User ID {user_id} not found")
    
    print(f"\n🎯 Top match(es) for User {user_row.iloc[0].get('id', user_id)}:")
    for match in top_matches:
        print(f"User {match['match_user_id']}")

    return 4 


def run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3):
    """Run the feedback loop to update weights and improve matches."""
    for i in range(num_iterations):
        weighted_vectors = compute_similarity(processed_users, q_agent.q_table)

        user_id = users_df['user_id'].iloc[0]  # Simulate with the first available ID
        top_matches = find_top_matches(user_id, weighted_vectors, users_df, top_k=3)

        feedback = simulate_feedback(user_id, top_matches, users_df)
        new_weights = q_agent.update_weights(feedback)
        print(f"\n🔄 Updated weights: {new_weights}")


def main():
    """Main function to run the study buddy matching algorithm."""
    users_df, processed_users, q_agent = initialize_algorithm()
    run_feedback_loop(users_df, processed_users, q_agent, num_iterations=3)


if __name__ == "__main__":
    main()