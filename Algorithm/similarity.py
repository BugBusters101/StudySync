# algorithm/similarity.py
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder
import pandas as pd


def preprocess_users(df):
    """Preprocess all features, including location with bounds to prevent DoS"""
    df = df.copy()
    
    # Cap list lengths to prevent dimensionality explosion and memory exhaustion
    for col in ['subjects', 'days_of_week', 'availability', 'location_details']:
        df[col] = df[col].apply(lambda x: [str(i)[:100] for i in x][:50] if isinstance(x, (list, tuple, set)) else [])
        
    df['learning_style'] = df['learning_style'].astype(str).str[:100]
    
    # Safely extract from location_type
    df['location_type'] = df['location_type'].apply(
        lambda loc: [str(i)[:100] for i in loc][:1] if isinstance(loc, (list, tuple, set)) and len(loc) > 0 else ['Unknown']
    )

    mlb = MultiLabelBinarizer()
    subjects_encoded = mlb.fit_transform(df['subjects'])
    subjects_df = pd.DataFrame(subjects_encoded, columns=[f"subject_{cls}" for cls in mlb.classes_])

    days_of_week_encoded = mlb.fit_transform(df['days_of_week'])
    days_of_week_df = pd.DataFrame(days_of_week_encoded, columns=[f"days_of_week_{cls}" for cls in mlb.classes_])

    availability_encoded = mlb.fit_transform(df['availability'])
    availability_df = pd.DataFrame(availability_encoded, columns=[f"availability_{cls}" for cls in mlb.classes_])

    learning_style_df = pd.get_dummies(df['learning_style'], prefix='style')
    location_type_df = pd.get_dummies(df['location_type'].apply(lambda loc: loc[0]), prefix='loc_type')

    location_details_encoded = mlb.fit_transform(df['location_details'])
    location_details_df = pd.DataFrame(location_details_encoded, columns=[f"loc_details_{cls}" for cls in mlb.classes_])

    return pd.concat([subjects_df, days_of_week_df, availability_df, learning_style_df, location_type_df, location_details_df], axis=1)


def compute_similarity(users_df, weights):
    """Apply weights to all feature groups (including location)"""
    weighted_vectors = users_df.copy()

    subject_cols = [col for col in users_df.columns if col.startswith("subject_")]
    days_of_week_cols = [col for col in users_df.columns if col.startswith("days_of_week_")]
    availability_cols = [col for col in users_df.columns if col.startswith("availability_")]
    style_cols = [col for col in users_df.columns if col.startswith("style_")]
    loc_type_cols = [col for col in users_df.columns if col.startswith("loc_type_")]
    loc_details_cols = [col for col in users_df.columns if col.startswith("loc_details_")]

    weighted_vectors[subject_cols] *= weights["subjects"]
    weighted_vectors[days_of_week_cols] *= weights["days_of_week"]
    weighted_vectors[availability_cols] *= weights["availability"]
    weighted_vectors[style_cols] *= weights["learning_style"]
    weighted_vectors[loc_type_cols] *= weights["location_type"]
    weighted_vectors[loc_details_cols] *= weights["location_details"]

    return weighted_vectors