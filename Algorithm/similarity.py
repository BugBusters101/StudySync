# algorithm/similarity.py
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder
import pandas as pd


def preprocess_users(df):
    """Preprocess all features, including location"""
    # 1. Encode subjects (multi-label)
    mlb = MultiLabelBinarizer()
    subjects_encoded = mlb.fit_transform(df['subjects'])
    subjects_df = pd.DataFrame(subjects_encoded, columns=[f"subject_{cls}" for cls in mlb.classes_])

    days_of_week_encoded = mlb.fit_transform(df['days_of_week'])
    days_of_week_df = pd.DataFrame(days_of_week_encoded, columns=[f"days_of_week_{cls}" for cls in mlb.classes_])

    # 2. Encode availability (multi-label)
    availability_encoded = mlb.fit_transform(df['availability'])
    availability_df = pd.DataFrame(availability_encoded, columns=[f"availability_{cls}" for cls in mlb.classes_])

    # 3. Encode learning_style (single-label)
    learning_style_df = pd.get_dummies(df['learning_style'], prefix='style')

    # 4. Encode location (combine type + details)
    df['location_combined'] = df['location'].apply(
        lambda loc: 'virtual' if loc['type'] == 'virtual' else loc['details']
    )
    location_df = pd.get_dummies(df['location_combined'], prefix='loc')

    # Combine all features
    return pd.concat([subjects_df, days_of_week_df, availability_df, learning_style_df, location_df], axis=1)


def compute_similarity(users_df, weights):
    """Apply weights to all feature groups (including location)"""
    weighted_vectors = users_df.copy()

    # Identify columns for each feature group
    subject_cols = [col for col in users_df.columns if col.startswith("subject_")]
    days_of_week_cols = [col for col in users_df.columns if col.startswith("days_of_week_")]
    availability_cols = [col for col in users_df.columns if col.startswith("availability_")]
    style_cols = [col for col in users_df.columns if col.startswith("style_")]
    loc_cols = [col for col in users_df.columns if col.startswith("loc_")]

    # Apply weights
    weighted_vectors[subject_cols] *= weights["subjects"]
    weighted_vectors[days_of_week_cols] *= weights["days_of_week"]
    weighted_vectors[availability_cols] *= weights["availability"]
    weighted_vectors[style_cols] *= weights["learning_style"]
    weighted_vectors[loc_cols] *= weights["location"]

    return cosine_similarity(weighted_vectors)