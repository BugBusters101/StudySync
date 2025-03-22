# algorithm/weights.py
def adjust_weights(feedback, current_weights, learning_rate=0.1):
    """Dynamically update preference weights based on feedback (1-5 stars)"""
    if feedback >= 4:  # Good match: boost weights
        current_weights = {k: v + learning_rate for k, v in current_weights.items()}
    elif feedback <= 2:  # Bad match: reduce weights
        current_weights = {k: v - learning_rate for k, v in current_weights.items()}

    # Normalize weights to sum to 1
    total = sum(current_weights.values())
    return {k: v / total for k, v in current_weights.items()}